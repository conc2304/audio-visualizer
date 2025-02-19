import * as THREE from 'three';
import store from '../../../store';
// import KeyboardControlsService from '@/js/services/KeyboardControlsService';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class VisualizerBaseThreeSketch {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private clock: THREE.Clock; // Use Three.js's Clock to handle time tracking
  private controls: OrbitControls;

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
      2000,
    );
    this.camera.position.set(0, 0, 500);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
    this.renderer.setClearColor(0x121212);
    this.container.appendChild(this.renderer.domElement);
    this.clock = new THREE.Clock();
    this.init();
  }

  private init(): void {
    this.addLights();
    this.animate();
    this.createControls();
  }

  private addLights(): void {
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    this.scene.add(light);
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);
    const elapsedTime = this.clock.getElapsedTime();
    this.update(elapsedTime);
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
        RegisteredSketches[sketchItem].easeInto();
      }

      if (typeof RegisteredSketches[sketchItem].update === 'function') {
        RegisteredSketches[sketchItem].update(elapsedTime, this.scene); // Update each sketch with the elapsed time
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

  private createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }
}
