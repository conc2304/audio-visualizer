<template lang="pug">
  ThreeJsCanvasWrapper( :pageTitle="'Normal Materials'")
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ThreeJsCanvasWrapper from "@/components/ThreeJsCanvasWrapper.vue";

import * as THREE from "three";

@Component({
  components: {
    ThreeJsCanvasWrapper,
  },
})
export default class LightSensitiveMaterials extends Vue {
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

  // geometries
  private cube!: THREE.Object3D;
  private sphere!: THREE.Object3D;
  private cone!: THREE.Object3D;

  // PRIVATE METHODS
  private sceneInit(): void {
    const lambertMaterial = new THREE.MeshLambertMaterial({
      side: THREE.DoubleSide,
      color: 0x7fc5f9,
      emissive: 0x25673d,
      emissiveIntensity: 0.7,
    });

    const phongMaterial = new THREE.MeshPhongMaterial({
      color: 0x03fcbe5,
      emissive: 0x5de4fc2,
      emissiveIntensity: 0.5,
      shininess: 100,
      specular: 0xff44dd,
    });

    const physicalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x03fcbe5,
      emissive: 0x5de4fc2,
      emissiveIntensity: 0.8,
      metalness: 0.5,
      roughness: 0.3,
    });

    const boxGeo = new THREE.BoxGeometry(12, 10, 15);
    this.cube = new THREE.Mesh(boxGeo, lambertMaterial);
    this.cube.position.x = -30;
    this.scene.add(this.cube);

    const sphereGeo = new THREE.SphereGeometry(12, 22, 22);
    this.sphere = new THREE.Mesh(sphereGeo, physicalMaterial);
    this.sphere.position.x = 0;
    this.scene.add(this.sphere);

    const coneGeo = new THREE.ConeGeometry(12, 15, 10, 10, true);
    this.cone = new THREE.Mesh(coneGeo, phongMaterial);
    this.cone.position.x = 35;
    this.scene.add(this.cone);
  }

  private animate(time: number): void {
    const velocity = 0.4;
    const distance = 80;
    this.cube.rotation.x = time * velocity;
    this.cube.rotation.z = time * velocity;

    this.sphere.rotation.x = time * velocity;
    this.sphere.rotation.y = time * velocity;
    this.sphere.rotation.z = time * velocity;
    this.sphere.position.x = Math.sin(time * velocity) * distance;
    this.sphere.position.y = Math.cos(time * velocity) * distance * -0.5;

    this.cone.rotation.x = time * velocity;
    this.cone.rotation.y = time * velocity;
    this.cone.rotation.z = time * velocity;
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

    const directionalLightUp = new THREE.DirectionalLight(0xffffff);
    this.scene.add(directionalLightUp);

    this.sceneInit();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const canvas = <HTMLCanvasElement>document.getElementById("threejs-canvas");
    canvas.appendChild(this.renderer.domElement);
  }

  private draw(time: number) {
    time *= 0.001;

    this.animate(time);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.draw);
  }
}
</script>
