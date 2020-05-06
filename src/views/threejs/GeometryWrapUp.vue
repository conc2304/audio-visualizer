<template lang="pug">
  #threejs-tut-wrapper
    h1 Geometry Wrap Up
    Navigation( :navType="'threejs'")
    #threejs-canvas
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import * as THREE from "three";
import { Object3D } from "three";
import Navigation from "@/components/Navigation.vue";

@Component({
  components: {
    Navigation,
  },
})
export default class GeometryWrapUp extends Vue {
  constructor() {
    super();
  }

  // COMPONENT DATA
  navType = "threejs";

  // LIFECYCLE HOOKS
  mounted(): void {
    this.init();
    this.draw(0);
  }
  created(): void {}
  beforeUpdate(): void {}

  // PRIVATE PROPERTIES
  private scene: THREE.Scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();
  private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
  private frustum: THREE.Frustum = new THREE.Frustum();
  private cubes: Array<CubeWrapper> = [];
  private cubeLimit = 69;

  // PRIVATE METHODS
  private sceneInit(): void {
    let i = 0;
    while (i < this.cubeLimit) {
      this.createCube();
      i++;
    }
  }

  private animate(time: number): void {
    this.cubes.forEach((cw: CubeWrapper, i) => {
      cw.cube.position.y -= cw.config.directionVelocity.y;
      cw.cube.position.z += cw.config.directionVelocity.z;
      cw.cube.rotation.z += cw.config.rotationVelocity.z;

      const pos = new THREE.Vector3(cw.cube.position.x, cw.cube.position.y, cw.cube.position.z);
      if (!this.frustum.containsPoint(pos)) {
        this.scene.remove(cw.cube);
        this.cubes.splice(i, 1);
        this.createCube();
      }
    });
  }

  private createCube(): void {
    const radius: number = this.randomInRange(1, 8);
    const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(radius, radius, radius);
    const material = new THREE.MeshDepthMaterial({});
    const cubeSpeed: CubeSpeed = { speed: this.randomInRange(0.01, 0.1) };
    const cube: Object3D = new THREE.Mesh(geometry, material);

    cube.position.x = this.randomInRange(-85, 85);
    cube.position.y = this.randomInRange(20, 80);
    cube.position.z = this.randomInRange(30, -100);

    this.scene.add(cube);

    const rVelocity = this.randomInRange(0.01, 0.1);
    const rotationDirection = (cube.position.x < 0) ? 1 : -1;
    const cubeConfig: CubeConfig = {
      rotationVelocity: {
        x: 0,
        y: 0,
        z: rVelocity * 0.2 * rotationDirection,
      },
      directionVelocity: {
        x: 0,
        y: rVelocity,
        z: rVelocity * 1.2 ,
      },
    };

    const cubeWrapper: CubeWrapper = {
      cube: cube,
      config: cubeConfig,
    };

    this.cubes.push(cubeWrapper);
  }

  private randomInRange(from: number, to: number): number {
    const x = Math.random() * (to - from);
    return x + from;
  }

  private init(): void {
    this.scene.background = new THREE.Color(0x00ef1d);

    const fov = 70;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 10;
    const far = 1000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.z = 100;

    this.camera.updateMatrix();
    this.camera.updateMatrixWorld();
    this.frustum.setFromProjectionMatrix(
      new THREE.Matrix4().multiplyMatrices(
        this.camera.projectionMatrix,
        this.camera.matrixWorldInverse,
      ),
    );

    this.sceneInit();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const canvas = <HTMLElement>document.getElementById("threejs-canvas");
    canvas.appendChild(this.renderer.domElement);
  }

  private draw(time: number) {
    time *= 0.001;

    this.animate(time);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.draw);
  }
}

export interface CubeSpeed {
  speed: number;
}

export interface XYZProps {
  x: number;
  y: number;
  z: number;
}
export interface CubeConfig {
  rotationVelocity: XYZProps;
  directionVelocity: XYZProps;
}

export interface CubeWrapper {
  cube: Object3D;
  config: CubeConfig;
}
</script>
