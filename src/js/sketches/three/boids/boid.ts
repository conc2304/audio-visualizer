import {
  Mesh,
  MeshBasicMaterial,
  ConeGeometry,
  Vector3,
  LineBasicMaterial,
  Line,
  BufferGeometry,
  Quaternion,
  Euler,
  Raycaster,
  Spherical,
  Shape,
  ShapeGeometry,
  DoubleSide,
} from 'three';
import { generateUUID } from 'three/src/math/MathUtils';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise';
import { getRandomInt } from '@/js/services/Utils';

export class Boid {
  boidMesh: Mesh;
  neighborhoodRadius: number;
  neighborhoodAngle: number;
  crowdingRadius: number;
  collisionRadius: number;
  maxRange: number;
  updateAngle: number;
  startAngle: number;
  endAngle: number;
  boidSpeed: number;
  rotationSpeed: number;
  weightOld: number;
  weightAvg: number;
  raycaster: Raycaster;
  id: string;
  noiseSeed: number;
  simplex: SimplexNoise;

  constructor() {
    this.neighborhoodRadius = 150;
    this.neighborhoodAngle = 20;
    this.crowdingRadius = 30;
    this.collisionRadius = 60;
    this.maxRange = 200;

    this.updateAngle = -Math.PI / 2;
    this.startAngle = this.neighborhoodAngle + this.updateAngle;
    this.endAngle = -this.neighborhoodAngle + this.updateAngle;

    this.boidSpeed = 2;
    this.rotationSpeed = 0.35;

    this.weightOld = 0.5;
    this.weightAvg = 0.5;

    this.raycaster = new Raycaster();

    this.id = generateUUID();
    this.noiseSeed = Math.round(Math.random() * Math.pow(5, 10));
    this.simplex = new SimplexNoise();
  }

  createBoid(maxRange: number = 200): Mesh {
    const boidHeight = 15;
    const boidWidth = 5;
    const geometry = new ConeGeometry(boidWidth, boidHeight, 6);
    const material = new MeshBasicMaterial({
      color: 0xffff00,
    });
    const boid = new Mesh(geometry, material);
    this.maxRange = maxRange;

    boid.position.set(0, 0, 0);
    boid.rotation.set(
      getRandomInt(-Math.PI, Math.PI),
      getRandomInt(-Math.PI, Math.PI),
      getRandomInt(-Math.PI, Math.PI),
    );

    this.boidMesh = boid;
    // this.addDebugging(this.boidMesh)

    return boid;
  }

  addDebugging(boid: Mesh) {
    const neighborhood = this.createBoidSector(
      this.neighborhoodRadius,
      this.startAngle,
      this.endAngle,
      { color: 0x00ff00, opacity: 0.1 },
    );
    const crowdingArea = this.createBoidSector(
      this.crowdingRadius,
      this.startAngle,
      this.endAngle,
      { color: 0xff0000, opacity: 0.45 },
    );
    const debugLine = this.createAngleLine();

    boid.add(neighborhood);
    boid.add(crowdingArea);
    boid.add(debugLine); // shows where angle 0 is
  }

  update(boidsList, walls, obstacles, attractors, elapsedTime) {
    // Make boids go in the same direction
    let heading = this.getAlignmentHeading(boidsList);

    // Avoid obstacles via repulsion
    heading = this.getAvoidanceHeading(walls, obstacles, heading);

    // Add Flocking Separation to boid
    heading = this.getSeparationHeading(boidsList, heading);

    heading = this.addAttractorForce(attractors, heading);

    // Calculate current and target quaternions
    const currentQuaternion = this.boidMesh.quaternion.clone();
    const targetQuaternion = new Quaternion();
    targetQuaternion.setFromUnitVectors(new Vector3(0, 1, 0), heading);

    const noiseScale = 0.05; // Scale down the time for smoother changes
    const noiseStrength = 0.01; // Control the range of rotation change
    const noiseX = this.simplex.noise(this.noiseSeed, elapsedTime * noiseScale) * noiseStrength;
    const noiseY =
      this.simplex.noise(Math.pow(this.noiseSeed, 2), elapsedTime * noiseScale) * noiseStrength; // Offset Y noise

    // Create a quaternion from noise-induced rotations
    const noiseQuaternion = new Quaternion();
    const noiseEuler = new Euler(noiseX, 0, noiseY, 'XYZ');
    noiseQuaternion.setFromEuler(noiseEuler);
    targetQuaternion.multiply(noiseQuaternion);

    // Spherical Linear Interpolation (slerp)
    this.boidMesh.quaternion.slerpQuaternions(
      currentQuaternion,
      targetQuaternion,
      this.rotationSpeed,
    );

    // Move the boid in the direction of the new heading
    this.boidMesh.position.add(heading.multiplyScalar(this.boidSpeed));

    // if they escape put them back in
    if (this.boidMesh.position.distanceTo(new Vector3()) > this.maxRange * 1.75) {
      this.boidMesh.position.set(0, 0, 0);
    }

    this.updateBoidColor(this.boidMesh, this.maxRange * 1.7);
  }

  getAlignmentHeading(boidsList) {
    // Move the boid forward in the direction of the heading
    const headingCurrent = this.getHeadingVector(this.boidMesh);

    // Calculate the avg heading based on general flock direction
    const headingFlockAvg = this.getAverageHeading(boidsList);
    const WaHa = headingFlockAvg.clone().multiplyScalar(this.weightAvg);
    const WoHc = headingCurrent.clone().multiplyScalar(this.weightOld);
    const WoWa = this.weightOld + this.weightAvg;

    const numerator = new Vector3().addVectors(WoHc, WaHa);
    const heading = numerator
      .clone()
      .divideScalar(WoWa)
      .normalize();

    return heading;
  }

  addAttractorForce(attractors, heading) {
    let nearestDistance = Infinity;
    let nearestAttractor = null;
    // get nearest attractor

    for (const attractor of attractors) {
      const distance = this.boidMesh.position.distanceTo(attractor.mesh.position);
      if (distance < nearestDistance) {
        nearestAttractor = attractor;
        nearestDistance = distance;
      }
    }
    if (!nearestAttractor) return heading;

    const attractionForce = nearestAttractor.calculateAttraction(this.boidMesh);
    const attractionHeading = heading.add(attractionForce);

    return attractionHeading;
  }

  getSeparationHeading(boidsList, heading) {
    let position = this.boidMesh.position;
    const separationHeading = new Vector3().add(heading);

    const repulsionPower = 4;
    const forceVector = new Vector3(0, 0, 0);

    boidsList.forEach((otherBoid, i) => {
      // Don't add self to average
      if (otherBoid.id === this.id) return;

      // Only separate boids in sector
      const boidInCrowdingArea = this.isBoidInSector(
        otherBoid.boidMesh,
        this.crowdingRadius,
        this.startAngle,
      );
      if (!boidInCrowdingArea) return;

      let positionOther = otherBoid.boidMesh.position;
      const distanceVector = new Vector3().subVectors(position, positionOther);
      const distance = distanceVector.length();

      if (distance > 0) {
        const repulsionStrength = 1 / Math.pow(distance / this.crowdingRadius, repulsionPower);
        distanceVector.normalize().multiplyScalar(repulsionStrength);
        forceVector.add(distanceVector);
      }
    });

    let tempSH = separationHeading.clone().add(forceVector);
    let tempAfter = tempSH.clone().normalize();

    return tempAfter;
  }

  getDistanceToObstacle(obstacle) {
    const boidPos = this.boidMesh.position.clone();

    // Ensure the obstacle has geometry and vertices
    if (!obstacle.geometry || !obstacle.geometry.attributes.position) {
      console.error('Obstacle must have geometry with vertices');
      return {
        distance: Infinity,
        closestPoint: null,
      };
    }

    // Get the vertices of the obstacle in world space
    const positionAttribute = obstacle.geometry.attributes.position;
    const matrixWorld = obstacle.matrixWorld;
    let closestPoint = null;
    let minDistance = Infinity;

    for (let i = 0; i < positionAttribute.count; i++) {
      // Get vertex in local space
      const vertex = new Vector3(
        positionAttribute.getX(i),
        positionAttribute.getY(i),
        positionAttribute.getZ(i),
      );

      // Transform vertex to world space
      vertex.applyMatrix4(matrixWorld);

      // Calculate distance to the boid
      const distance = boidPos.distanceTo(vertex);

      // Update closest point if this vertex is nearer
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = vertex.clone();
      }
    }

    // Return the closest distance and point
    return {
      distance: minDistance,
      closestPoint: closestPoint,
    };
  }

  avoidObstacleCollision(obstacles) {
    const steer = new Vector3();
    // obstacles.map((obstacle) => {
    //     obstacle.material.color.setHex(0x00ffff);
    // });

    this.raycaster.set(this.boidMesh.position, this.getHeadingVector(this.boidMesh));
    const intersects = this.raycaster.intersectObjects(obstacles);

    if (intersects.length > 0) {
      // The ray intersects an object, and intersects[0] is the closest one
      const closestIntersection = intersects[0];
      const distanceToCollision = closestIntersection.distance;

      console.log(intersects[0].object.name);

      // To get the world normal:
      // Transform the normal to world coordinates
      const normal = closestIntersection.face.normal;
      const worldNormal = normal
        .clone()
        .transformDirection(closestIntersection.object.matrixWorld)
        .normalize();

      return {
        normal: worldNormal,
        obstacle: intersects[0],
        distance: distanceToCollision,
      };
    } else {
      // console.log("No obstacles were hit by the ray.");
      return {
        normal: steer,
        obstacle: null,
        distance: 0,
      };
    }
  }

  createAngleLine() {
    const points = [];
    points.push(new Vector3(0, 0, 0));
    points.push(new Vector3(0, this.neighborhoodRadius, 0));

    const geometry = new BufferGeometry().setFromPoints(points);
    const material = new LineBasicMaterial({ color: 0xff0000 });
    const line = new Line(geometry, material);

    return line;
  }

  createBoidSector(radius, startAngle, endAngle, materialConf) {
    // Define and create the arc shape
    const shape = new Shape();
    const centerX = 0; // X coordinate of the center of the arc
    const centerY = 0; // Y coordinate of the center of the arc

    // Move to the center
    shape.moveTo(centerX, centerY);

    // Line to the start of the arc
    shape.lineTo(centerX + radius * Math.cos(startAngle), centerY + radius * Math.sin(startAngle));
    // shape.lineTo(centerX + radius * Math.cos(this.startAngle), centerY + radius * Math.sin(this.startAngle));

    // Arc
    shape.absarc(centerX, centerY, radius, startAngle, endAngle, false);

    // Line back to the center
    shape.lineTo(centerX, centerY);

    const geometry = new ShapeGeometry(shape);
    const material = new MeshBasicMaterial({
      color: 0xff0000,
      opacity: 0.15,
      side: DoubleSide,
      transparent: true,
      ...materialConf,
    });
    const mesh = new Mesh(geometry, material);

    return mesh;
  }

  isBoidInSector(boidOther, radius, startAngle) {
    // Check if inside radius
    const distanceToBoid = boidOther.position.distanceTo(this.boidMesh.position);
    const boidInRadius = distanceToBoid < radius;
    if (!boidInRadius) return false;

    const relativePos = new Vector3();
    relativePos.subVectors(this.boidMesh.position, boidOther.position);

    // Define the axis to rotate around = Z
    const axis = new Vector3(0, 0, 1);

    // Define the angle of rotation in radians
    const angle = -this.boidMesh.rotation.z;

    const tempSpherical = new Spherical();
    tempSpherical.setFromVector3(relativePos);
    const { theta } = tempSpherical;

    // Rotate the vector
    relativePos.applyAxisAngle(axis, angle);

    const boidInAngle = Math.abs(theta) < Math.abs(startAngle);
    // console.log({ boidInAngle })
    return boidInAngle;
  }

  getAvoidanceHeading(walls, obstacles, currentHeading) {
    // avoid obstacles via repulsion
    let newHeading = currentHeading;

    let totalRepulsion = new Vector3();
    let obstaclePushCount = 0;

    walls.forEach(wall => {
      const { distance, closestPoint } = this.getDistanceToObstacle(wall);

      if (distance < this.collisionRadius) {
        obstaclePushCount++;
        // raycast at closest point to get the normal of the face that it hits
        const rayDirection = new Vector3()
          .subVectors(closestPoint, this.boidMesh.position)
          .normalize();
        this.raycaster.set(this.boidMesh.position, rayDirection);
        const intersects = this.raycaster.intersectObjects(walls);

        let worldNormal = new Vector3();
        if (intersects.length > 0) {
          const closestIntersection = intersects[0];
          const normal = closestIntersection.face.normal;
          worldNormal = normal
            .clone()
            .transformDirection(closestIntersection.object.matrixWorld)
            .normalize();
        }
        const repulsionScale = 1 - distance / this.collisionRadius;
        const repulsionVector = new Vector3()
          .add(worldNormal)
          .multiplyScalar((wall.repulsion || 5) * repulsionScale);
        totalRepulsion = totalRepulsion.add(repulsionVector);
      }
    });

    if (obstaclePushCount > 0) {
      const avgRepulsion = totalRepulsion.divideScalar(obstaclePushCount);
      newHeading = newHeading.add(avgRepulsion);
    }

    // this.avoidObstacleCollision(obstacles);

    return newHeading;
  }

  getAverageHeading(boids) {
    let headingSum = new Vector3(0, 0, 0);
    let count = 0;
    boids.forEach(boid => {
      // Don't add self to average
      if (boid.id === this.id) return;
      // Only average boids in sector
      if (!this.isBoidInSector(boid.boidMesh, this.neighborhoodRadius, this.startAngle)) return;

      // console.log(`${boid.id} is in sector of ${this.id}`);

      const headingVector = this.getHeadingVector(boid.boidMesh);

      headingSum.add(headingVector);
      count++;
    });

    // console.log({headingSum, count})
    if (count === 0) return this.getHeadingVector(this.boidMesh);

    const avgHeading = headingSum.clone().divideScalar(count);

    return avgHeading;
  }

  getHeadingVector(meshObject) {
    // Create a vector pointing up the Y-axis (local forward direction)
    const forward = new Vector3(0, 1, 0);
    forward.normalize();

    // Apply the object's rotation to this vector
    forward.applyQuaternion(meshObject.quaternion);

    return forward.normalize();
  }

  updateBoidColor(boidMesh, range, saturation = 1) {
    const pos = boidMesh.position;
    const rot = boidMesh.rotation;

    // Normalize position and rotation values to a 0-1 range for color calculation
    const normX = (pos.x - range) / range; // Assuming position ranges are known
    const normY = (pos.y - range) / range;
    const normZ = (pos.z - range) / range;
    const normRotX = (rot.x % (2 * Math.PI)) / (2 * Math.PI);
    const normRotY = (rot.y % (2 * Math.PI)) / (2 * Math.PI);
    const normRotZ = (rot.z % (2 * Math.PI)) / (2 * Math.PI);

    // Combine normalized values to create a unique color
    const r = Math.abs(normX + normRotX) / 2;
    const g = Math.abs(normY + normRotY) / 2;
    const b = Math.abs(normZ + normRotZ) / 2;

    boidMesh.material.color.setRGB(r, g, b);

    const hsl = boidMesh.material.color.getHSL({});

    // Adjust saturation and convert back to RGB
    boidMesh.material.color.setHSL(hsl.h, saturation, hsl.l);
  }
}
