<template lang="pug">
  #tutorials-wrapper
    h1 Animation Rigs
    h2 {{ msg }}
    #webgl-wrapper
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/dat.gui.module";
import perlinNoise3d from "perlin-noise-3d";

const ThreeProps = Vue.extend({
  props: {},
});

@Component
export default class AnimationRig extends Vue {
  msg = "test";

  // THREE JS PROPS
  public scene = new THREE.Scene();
  public renderer = new THREE.WebGLRenderer({ antialias: true });
  public camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000,
  );
  public clock = new THREE.Clock();
  public controls = new OrbitControls(this.camera, this.renderer.domElement);
  public cameraRigYPosition = new THREE.Group();
  public cameraRigZPosition = new THREE.Group();
  public noise = new perlinNoise3d();

  // Component LifeCycle Hooks
  public mounted() {
    this.init();
    this.animate();
  }

  // Private Properties
  private animate() {
    const speed = 0.05;
    const time = this.clock.getElapsedTime() * speed;
    // const noise = - 5 + this.noise.get(time) * 5;
    // console.log(noise);

    const cameraInRange =
      this.cameraRigYPosition.position.z < -40 ||
      this.cameraRigYPosition.position.z > 40;

    this.controls.update();

    if (this.cameraRigYPosition.position.y > 1) {
      this.cameraRigYPosition.position.y -= 0.1;
    } else {
      this.cameraRigYPosition.position.z += 0.05;
      this.camera.lookAt(0, 1, 200);
      // this.camera.rotation.z += noise;
    }

    if (cameraInRange) {
      console.log("turn");
      this.camera.lookAt(0, 1, 0);
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  }

  private init() {
    if (!this.renderer) {
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
    }
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    const canvas = document.getElementById("webgl-wrapper");
    if (canvas) {
      canvas.innerHTML = "";
      canvas.appendChild(this.renderer.domElement);
    }

    const axesHelper = new THREE.AxesHelper(8);
    const plane = this.getPlane(300);
    plane.rotation.x = -Math.PI / 2;
    plane.add(axesHelper);

    this.scene.add(plane);
    this.scene.add(axesHelper);

    // Camera Rig

    this.cameraRigYPosition.add(this.camera);
    this.cameraRigZPosition.add(this.cameraRigYPosition);
    // this.camera.position.set(0, 10, -10);
    this.cameraRigYPosition.position.set(0, 10, -10);
    this.scene.add(this.cameraRigYPosition);

    const light = this.getSpotLight(0.7);
    light.add(axesHelper);
    this.scene.add(light);
    light.position.set(0, 10, 0);

    // Objects

    const boxGrid = this.getBoxGrid(8, 2, 1);
    boxGrid.add(axesHelper);
    boxGrid.name = "boxGrid";
    this.scene.add(boxGrid);
  }

  private getBox(
    width: number = 1,
    height: number = 1,
    depth: number = 1,
  ): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      // wireframe: true,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;

    return cube;
  }

  private getBoxGrid(
    amount: number,
    separationMultiplier: number,
    size: number,
  ): THREE.Group {
    const group = new THREE.Group();
    const gridSizeHalf =
      (amount * size + (amount - 1) * ((separationMultiplier - 1) * size)) *
        0.5 -
      size / 2;

    for (let i = 0; i < amount; i++) {
      for (let j = 0; j < amount; j++) {
        const box = this.getBox(1, 1, 1);
        box.position.x = i * separationMultiplier - gridSizeHalf;
        box.position.y =
          (box.geometry as THREE.BoxGeometry).parameters.height / 1;
        box.position.z = j * separationMultiplier - gridSizeHalf;
        group.add(box);
      }
    }

    return group;
  }

  private getSpotLight(intensity: number): THREE.SpotLight {
    const light = new THREE.SpotLight(0xffffff, intensity);
    light.castShadow = true;
    light.shadow.bias = 0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.penumbra = 0.5;
    light.lookAt(0, 0, 0);

    const sphere = this.getSphere(0.2);
    const helper = new THREE.CameraHelper(light.shadow.camera);
    light.add(sphere);
    this.scene.add(helper);

    return light;
  }
  private getSphere(radius: number): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(radius, 10, 10);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });

    const mesh = new THREE.Mesh(geometry, material);

    return mesh;
  }

  private getPlane(size: number): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(size, size, 10, 10);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
      // wireframe: true,
    });

    const mesh = new THREE.Mesh(geometry, material);

    mesh.receiveShadow = true;

    return mesh;
  }

  private getControls() {
    // Orbit Controls
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    // controls.target.set(0, 0, 0);
    controls.update();
  }
}
</script>
