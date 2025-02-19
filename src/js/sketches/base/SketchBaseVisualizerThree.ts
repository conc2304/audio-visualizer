import * as THREE from 'three';
import store from '../../../store';
// import KeyboardControlsService from '@/js/services/KeyboardControlsService';

export class VisualizerBaseThreeSketch {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private clock: THREE.Clock; // Use Three.js's Clock to handle time tracking

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error('Container element not found');
    }
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);
    this.clock = new THREE.Clock(); // Initialize the clock
    this.init();
  }

  private init(): void {
    this.camera.position.z = 5;
    this.addLights();
    this.animate();
  }

  private addLights(): void {
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    this.scene.add(light);
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);
    const elapsedTime = this.clock.getElapsedTime(); // Get the elapsed time
    this.update(elapsedTime); // Pass the elapsed time to update
    this.renderer.render(this.scene, this.camera);
  };

  protected update(elapsedTime: number): void {
    const RegisteredSketches = store.getters.RegisteredSketches;
    for (let sketchItem in RegisteredSketches) {
      if (!RegisteredSketches.hasOwnProperty(sketchItem)) {
        continue;
      }

      if (RegisteredSketches[sketchItem].type !== 'three') continue;

      // don't render an object if we have made it not visible
      if (RegisteredSketches[sketchItem].bypass === true) {
        continue;
      }

      if (RegisteredSketches[sketchItem].easeInto) {
        RegisteredSketches[sketchItem].easeInto(); // Pass the elapsed time to the easing function if it exists
      }

      if (typeof RegisteredSketches[sketchItem].update === 'function') {
        RegisteredSketches[sketchItem].update(elapsedTime); // Update each sketch with the elapsed time
      }
    }
  }

  public destroy(): void {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    this.renderer.dispose();
    this.clock.stop(); // Stop the clock when destroying the scene
  }
}
