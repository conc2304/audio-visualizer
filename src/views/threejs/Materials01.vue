<template lang="pug">
  ThreeJsCanvasWrapper( :pageTitle="'Materials 01'")
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
export default class Materials01 extends Vue {
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

  private cube1!: Object3D;
  private cube2!: Object3D;
  private plane!: Object3D;
  private normals!: any;
  private sphere!: Object3D;
  private sphereNormals!: any;

  // PRIVATE METHODS
  private sceneInit(): void {
    this.createGeometry();
  }

  private animate(time: number): void {
    const velocity = 0.4;
    const distance = 80;
    this.normals.update();
    this.cube1.position.x = Math.sin(time * velocity) * distance;
    this.cube2.position.x = Math.cos(time * velocity) * distance;

    this.sphere.rotation.x = Math.sin(time * velocity);
    this.sphere.rotation.y = Math.sin(time * velocity);
    this.sphere.rotation.z = Math.sin(time * velocity);
    this.sphereNormals.update();
  }

  private init(): void {
    this.scene.background = new THREE.Color(0x001100);

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
    const boxSize = 35;
    const floorHeight = -50;
    const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);

    // CUBE 1
    this.cube1 = new THREE.Mesh(
      boxGeometry,
      new THREE.MeshBasicMaterial({
        color: 0xc000cc,
        transparent: true,
        opacity: 0.8,
      }),
    );
    this.cube1.position.z = -300;
    this.cube1.position.y = floorHeight + boxSize * 0.5;
    this.scene.add(this.cube1);

    // CUBE 2
    this.cube2 = new THREE.Mesh(
      boxGeometry,
      new THREE.MeshBasicMaterial({
        color: 0xa6f995,
        transparent: true,
        opacity: 0.8,
      }),
    );
    this.normals = new FaceNormalsHelper(this.cube2, 10);
    this.scene.add(this.cube2);
    this.scene.add(this.normals);

    this.cube2.position.z = -20;
    this.cube2.position.y = floorHeight + boxSize * 0.5;

    // PLANE
    this.plane = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000, 50, 50),
      new THREE.MeshBasicMaterial({
        color: 0xa6f995,
        wireframe: true,
      }),
    );
    this.plane.rotation.x = Math.PI / 2;
    this.plane.position.y = floorHeight;
    this.scene.add(this.plane);

    // SPHERE
    this.sphere = new THREE.Mesh(new THREE.SphereGeometry(33), new THREE.MeshNormalMaterial());
    this.sphereNormals = new FaceNormalsHelper(this.sphere, 10);
    this.sphere.position.z = -50;
    this.scene.add(this.sphere);
    this.scene.add(this.sphereNormals);

  }

  private draw(time: number) {
    time *= 0.001;

    this.animate(time);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.draw);
  }
}
</script>
