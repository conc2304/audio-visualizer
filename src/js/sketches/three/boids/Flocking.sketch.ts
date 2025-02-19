import { BaseSketch, P5Base } from '@/js/interfaces/P5Sketch.interface';
import NumericProperty from '@/js/services/PropertyConstructorNumeric';
import VariableProperty from '@/js/services/PropertyConstructorVariable';
import CatalogueDataEntry from '@/js/services/CatalogueDataEntry';
import { Boid } from '@/js/sketches/three/boids/boid';
import { getRandomInRange } from '@/js/services/Utils';
import { Mesh, MeshBasicMaterial, PlaneGeometry, Vector3, Scene } from 'three';
import { Attractor } from '@/js/sketches/three/boids/attractor';

export default class FlockingBoids extends P5Base implements BaseSketch {
  constructor() {
    super('three');
  }

  public catalogueInfo = new CatalogueDataEntry(
    this,
    this.type,
    '3D Sine Wave',
    'A parametric sine wave with various 3D shapes as point along the wave.',
    ['Parametric', '3D'],
    'clyzby',
    'webgl-wave_200.gif',
    277,
    4,
    '2019-07-17',
  );

  public boidsQty = new NumericProperty('Total Boids', 'Base', 20, 1, 250, 1, 1);
  public attractorsQty = new NumericProperty('Total Attractors', 'Base', 3, 0, 20, 1, 1);
  public attractorsVisible = new VariableProperty('Attractors Visible', 'Base', 'Visible', [
    'Visible',
    'Hidden',
  ]);
  public boxSize = new NumericProperty('Bounding Box Size', 'Base', 700, 50, 2000, 0.7, 5);

  private scene: Scene;
  private boids = [];
  private walls = [];
  private obstacles = [];
  private attractors = [];
  private initialized = false;
  private planesGroup = new Mesh();

  public init(scene: Scene) {
    this.scene = scene;
    this.createBoids(this.boxSize.currentValue / 2, scene);
    this.createBoidsBox(this.boxSize.currentValue, true, scene);
    // this.createObstacles();
    this.createAttractors(15, this.boxSize.currentValue, scene);
  }

  public update(elapsedTime: number, scene: Scene) {
    if (!this.initialized) {
      console.log('init');
      this.init(scene);
      this.initialized = true;
      return;
    }

    // Remove excess
    this.adjustAttractorQuantity(this.attractorsQty.currentValue);
    this.adjustBoidQuantity(this.boidsQty.currentValue);

    for (const boid of this.boids) {
      boid.update(this.boids, this.walls, this.obstacles, this.attractors, elapsedTime);
    }

    for (const attractor of this.attractors) {
      attractor.update(elapsedTime);
    }
  }

  private createBoids(maxRange = 200, scene) {
    for (let i = 0; i < this.boidsQty.currentValue; i++) {
      const boid = new Boid();
      const boidMesh = boid.createBoid(maxRange);

      this.boids[i] = boid;
      scene.add(boidMesh);
    }
  }

  private createBoidsBox(size: number, isVisible = false, scene: Scene) {
    const halfSize = size / 2;
    const frameMaterial = new MeshBasicMaterial({
      color: 0x00ffff,
      opacity: 0.1,
      // side: DoubleSide,
      wireframe: true,
      transparent: true,
    });

    // Create a single plane rotated appropriately to form the box with normals pointed inware
    const createPlane = (
      width: number,
      height: number,
      rotation: Vector3,
      position: Vector3,
      name: string,
    ) => {
      const geometry = new PlaneGeometry(width, height, 10, 10);
      const plane = new Mesh(geometry, frameMaterial);
      plane.name = name;
      plane.rotation.x = rotation.x;
      plane.rotation.y = rotation.y;
      plane.rotation.z = rotation.z;
      plane.position.set(position.x, position.y, position.z);

      plane.visible = isVisible;
      return plane;
    };

    // Create six planes to form an enclosed box
    const planes = [];
    planes.push(
      createPlane(
        size,
        size,
        new Vector3(-Math.PI / 2, 0, 0),
        new Vector3(0, -halfSize, 0),
        'bottomWall',
      ),
    );
    planes.push(
      createPlane(
        size,
        size,
        new Vector3(Math.PI / 2, 0, 0),
        new Vector3(0, halfSize, 0),
        'topWall',
      ),
    );

    planes.push(
      createPlane(
        size,
        size,
        new Vector3(0, Math.PI / 2, 0),
        new Vector3(-halfSize, 0, 0),
        'leftWall',
      ),
    );
    planes.push(
      createPlane(
        size,
        size,
        new Vector3(0, -Math.PI / 2, 0),
        new Vector3(halfSize, 0, 0),
        'rightWall',
      ),
    );

    planes.push(
      createPlane(size, size, new Vector3(0, Math.PI, 0), new Vector3(0, 0, halfSize), 'frontWall'),
    );
    planes.push(
      createPlane(size, size, new Vector3(0, 0, 0), new Vector3(0, 0, -halfSize), 'backWall'),
    );

    scene.add(this.planesGroup);

    // Add planes to the scene
    planes.forEach((plane, i) => {
      plane.repulsion = 5;
      this.walls.push(plane);
      this.planesGroup.add(plane);
    });
  }

  private createAttractors(attractorsQty = 0, boundingRange = 100, scene: Scene) {
    for (let i = 0; i < attractorsQty; i++) {
      const strength = getRandomInRange(-0.5, 0.45);
      const speed = strength < 0 ? 0.05 : 0.15;
      const range = strength < 0 ? 100 : getRandomInRange(300, 700);

      const attractor = new Attractor({
        position: new Vector3(),
        strength,
        range,
        speed,
        boundingSize: boundingRange * 0.5,
        isVisible: this.attractorsVisible.currentValue === 'Visible',
      });

      this.attractors.push(attractor);
      scene.add(attractor.mesh);
    }
  }

  private adjustBoidQuantity(targetQty: number): void {
    const currentQty = this.boids.length;
    if (targetQty > currentQty) {
      for (let i = currentQty; i < targetQty; i++) {
        const newBoid = new Boid();
        this.boids.push(newBoid);
        this.scene.add(newBoid.createBoid(200)); // Assume maxRange is 200
      }
    } else if (targetQty < currentQty) {
      for (let i = currentQty - 1; i >= targetQty; i--) {
        const boid = this.boids.pop();
        if (boid) {
          this.scene.remove(boid.boidMesh);
        }
      }
    }
  }

  private adjustAttractorQuantity(targetQty: number): void {
    const currentQty = this.attractors.length;
    if (targetQty > currentQty) {
      for (let i = currentQty; i < targetQty; i++) {
        const newAttractor = new Attractor({
          position: new Vector3(),
          strength: getRandomInRange(-0.5, 0.45),
          range: getRandomInRange(100, 700),
          speed: 0.1,
          boundingSize: 500,
          isVisible: false,
        });
        this.attractors.push(newAttractor);
        this.scene.add(newAttractor.mesh);
      }
    } else if (targetQty < currentQty) {
      for (let i = currentQty - 1; i >= targetQty; i--) {
        const attractor = this.attractors.pop();
        if (attractor) {
          this.scene.remove(attractor.mesh);
        }
      }
    }
  }

  public render(p5) {
    // do nothing
  }
}
