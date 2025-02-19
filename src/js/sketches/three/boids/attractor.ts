import { Mesh, MeshBasicMaterial, SphereGeometry, Vector3 } from 'three';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise'; // Correct import path for SimplexNoise

interface AttractorOptions {
  position: Vector3 | [number, number, number];
  strength: number;
  range: number;
  boundingSize: number;
  speed: number;
  isVisible?: boolean;
}

export class Attractor {
  position: Vector3;
  strength: number;
  range: number;
  isVisible: boolean;
  noise: SimplexNoise;
  noiseScale: number;
  bounds: { x: [number, number]; y: [number, number]; z: [number, number] };
  mesh: Mesh;

  constructor(options: AttractorOptions) {
    this.position =
      options.position instanceof Vector3 ? options.position : new Vector3(...options.position);
    this.strength = options.strength;
    this.range = options.range;
    this.isVisible = options.isVisible !== undefined ? options.isVisible : true;
    this.noise = new SimplexNoise();
    this.noiseScale = options.speed;
    this.bounds = {
      x: [-options.boundingSize, options.boundingSize],
      y: [-options.boundingSize, options.boundingSize],
      z: [-options.boundingSize, options.boundingSize],
    };

    const geometry = new SphereGeometry(5, 32, 32);
    const material = new MeshBasicMaterial({ color: this.strength > 0 ? 0xff0000 : 0xffffff });
    this.mesh = new Mesh(geometry, material);
    this.mesh.position.copy(this.position);
    this.mesh.visible = this.isVisible;
  }

  update(time: number): void {
    this.moveWithNoise(time);
    this.mesh.position.copy(this.position);
  }

  moveWithNoise(time: number): void {
    this.position.x =
      (this.noise.noise(time * this.noiseScale, 0) * 0.5 + 0.5) *
        (this.bounds.x[1] - this.bounds.x[0]) +
      this.bounds.x[0];
    this.position.y =
      (this.noise.noise(time * this.noiseScale, 1) * 0.5 + 0.5) *
        (this.bounds.y[1] - this.bounds.y[0]) +
      this.bounds.y[0];
    this.position.z =
      (this.noise.noise(time * this.noiseScale, 2) * 0.5 + 0.5) *
        (this.bounds.z[1] - this.bounds.z[0]) +
      this.bounds.z[0];
  }

  calculateAttraction(boid: { position: Vector3 }): Vector3 {
    const distanceVector = new Vector3().subVectors(this.position, boid.position);
    const distance = distanceVector.length();
    if (distance < this.range) {
      return distanceVector.normalize().multiplyScalar(this.strength);
    }
    return new Vector3(0, 0, 0);
  }

  setVisible(isVisible: boolean): void {
    this.mesh.visible = isVisible;
    this.isVisible = isVisible;
  }
}
