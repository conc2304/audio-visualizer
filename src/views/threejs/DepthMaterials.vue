<template lang="pug">
  ThreeJsCanvasWrapper( :pageTitle="'Depth Materials'")
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ThreeJsCanvasWrapper from "@/components/ThreeJsCanvasWrapper.vue";

import * as THREE from "three";
import { Object3D, SphereGeometry } from "three";
import { FaceNormalsHelper } from "three/examples/jsm/helpers/FaceNormalsHelper.js";

@Component({
  components: {
    ThreeJsCanvasWrapper,
  },
})
export default class DepthMaterials extends Vue {
  constructor() {
    super();
  }

  // PROPS

  // COMPONENT DATA

  // LIFECYCLE HOOKS
  mounted(): void {
    this.init();
    this.draw(0);
  }
  created(): void {}
  beforeUpdate(): void {}

  // PRIVATE PROPERTIES
  private camera!: THREE.PerspectiveCamera;
  private scene: THREE.Scene = new THREE.Scene();
  private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
  private frustum: THREE.Frustum = new THREE.Frustum();
  private cube!: Object3D;
  private sphere!: Object3D;

  // PRIVATE METHODS
  private sceneInit(): void {
    this.createGeometry();
  }

  private animate(time: number): void {
    const velocity = 0.4;
    const distance = 80;
    this.cube.position.z = Math.sin(time * velocity) * distance;
    this.sphere.position.z = Math.cos(time * velocity) * distance;
  }

  private init(): void {
    this.scene.background = new THREE.Color(0x0011df);

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

  private createGeometry(): void {
    let cubeGeometry = new THREE.BoxGeometry(15, 10, 20);
    let sphereGeometry = new THREE.SphereGeometry(10);
    let depthMaterial = new THREE.MeshDepthMaterial();

    this.cube = new THREE.Mesh(cubeGeometry, depthMaterial);
    this.cube.position.x = -20;
    this.cube.position.z = -100;
    this.scene.add(this.cube);

    this.sphere = new THREE.Mesh(sphereGeometry, depthMaterial);
    this.sphere.position.x = 20;
    this.sphere.position.z = 50;
    this.scene.add(this.sphere);
  }

  private draw(time: number) {
    time *= 0.001;

    this.animate(time);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.draw);
  }
}
</script>
