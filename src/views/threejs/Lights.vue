<template lang="pug">
  #tutorial
    h1 Lights

    #threeJS-canvas
</template>

<script lang="ts">
import Vue from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/dat.gui.module";
import perlinNoise3d from "perlin-noise-3d";

let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let camera: THREE.PerspectiveCamera;
// let camera: THREE.OrthographicCamera;
// let controls: OrbitControls;
let light: THREE.SpotLight;
let boxGrid: THREE.Group;

let clock: THREE.Clock;

const cameraZRot = new THREE.Group();
const cameraYPos = new THREE.Group();
const cameraZPos = new THREE.Group();
const cameraXRot = new THREE.Group();
const cameraYRot = new THREE.Group();
// const noise = new perlinNoise3d();
const enableFog = true;

export default Vue.extend({
  components: {},
  data: () => ({}),
  methods: {
    animate(clockObj: THREE.Clock) {
      const speed = 0.5;
      const time = clockObj.getElapsedTime() * speed;

      // controls.update();
      renderer.render(scene, camera);

      const boxGridGroup = scene.getObjectByName("boxGrid");

      if (boxGridGroup) boxGridGroup.position.y = 3 + Math.sin(time) * 2;

      const boxHeight = 1;
      boxGridGroup?.children.forEach((box: THREE.Object3D, index: number) => {
        box.position.y = boxHeight + Math.sin(time * 0.5 + index) * 0.5;
        box.scale.y = 1 + Math.sin(time) * 0.5;
      });

      // cameraZPos.position.z -= 0.1;

      // if (cameraZPos.position.z > 1) {
      //   cameraXRot.rotation.x = THREE.MathUtils.mapLinear(
      //     cameraZPos.position.z,
      //     1,
      //     35,
      //     -Math.PI / 2,
      //     0,
      //   );
      // }

      cameraZRot.rotation.z = 0;

      // cameraXRot.rotation.z = -0.5 + noise.get(time * 0.5) * 5;

      light.position.x = Math.sin(time) * 2;
      light.position.z = Math.cos(time) * 10;

      requestAnimationFrame(() => {
        this.animate(clock);
      });
    },
    init() {
      // Scene
      clock = new THREE.Clock();
      scene = new THREE.Scene();

      if (enableFog) {
        scene.fog = new THREE.FogExp2(0xffffff, 0.001);
      }

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputEncoding = THREE.sRGBEncoding;

      const canvas = document.getElementById("threeJS-canvas");
      if (canvas) canvas.innerHTML = "";
      canvas?.appendChild(renderer.domElement);

      // Camera
      const fov = 45;
      const aspect = window.innerWidth / window.innerHeight;
      const near = 1;
      const far = 1000;

      camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      // Camera Rig
      cameraXRot.rotation.x = -Math.PI / 2;
      cameraZRot.add(camera);
      cameraYPos.add(cameraZRot);
      cameraZPos.add(cameraYPos);
      cameraXRot.add(cameraZPos);
      cameraYRot.add(cameraXRot);

      camera.position.set(0, -20, 50);
      // camera.lookAt(new THREE.Vector3(0, 4, 0));
      scene.add(cameraYRot);

      const axesHelper = new THREE.AxesHelper(8);

      // Orbit Controls
      // controls = new OrbitControls(camera, renderer.domElement);
      // // controls.target.set(0, 0, 0);
      // controls.update();

      // Floor
      const plane = this.getPlane(1000);
      plane.name = "plane-1";
      plane.add(axesHelper);
      // plane.rotation.x = -Math.PI / 2;
      // plane.position.set(0, 0, 0);

      // Lighting
      light = this.getSpotLight(10);
      light.position.set(0, 20, 0);
      const sphere = this.getSphere(0.2);
      const helper = new THREE.CameraHelper(light.shadow.camera);
      light.add(sphere);
      scene.add(helper);

      // Objects
      const boxRows = 8;
      const boxSize = 1;
      const boxSpacing = 2;
      boxGrid = this.getBoxGrid(boxRows, boxSpacing, boxSize);
      boxGrid.add(axesHelper);
      boxGrid.name = "boxGrid";
      scene.add(boxGrid);

      scene.add(plane);
      scene.add(light);
      scene.add(axesHelper);

      this.getGui();
    },

    getBoxGrid(
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
    },

    getBox(
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
    },

    getSphere(radius: number): THREE.Mesh {
      const geometry = new THREE.SphereGeometry(radius, 10, 10);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
      });

      const mesh = new THREE.Mesh(geometry, material);

      return mesh;
    },

    getPlane(size: number): THREE.Mesh {
      const geometry = new THREE.PlaneGeometry(size, size, 10, 10);
      const material = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide,
        // wireframe: true,
      });

      const mesh = new THREE.Mesh(geometry, material);

      mesh.receiveShadow = true;

      return mesh;
    },

    getSpotLight(intensity: number): THREE.SpotLight {
      const lightSource = new THREE.SpotLight(0xffffff, intensity);
      lightSource.castShadow = true;
      lightSource.shadow.bias = 0.001;
      lightSource.shadow.mapSize.width = 2048;
      lightSource.shadow.mapSize.height = 2048;
      lightSource.penumbra = 0.5;

      return lightSource;
    },

    getAmbientLight(intesity: number) {
      const lightSource = new THREE.AmbientLight("rgb(10, 30, 49)", intesity);
      return lightSource;
    },

    getDirectionalLight(intesity: number): THREE.DirectionalLight {
      const lightSource = new THREE.DirectionalLight(0xffffff, intesity);
      lightSource.castShadow = true;

      lightSource.shadow.camera.left = -10;
      lightSource.shadow.camera.bottom = -10;
      lightSource.shadow.camera.right = 10;
      lightSource.shadow.camera.top = 10;

      return lightSource;
    },

    getGui() {
      const gui = new GUI({ width: 300 });
      gui.open();

      const params = {
        intensity: light.intensity,
        Zoom: camera.position.z,
      };

      // const

      gui.add(params, "Zoom", -100, 100).onChange((val: number) => {
        cameraZPos.position.z = val;
      });

      gui.add(cameraXRot.rotation, "x", -Math.PI, Math.PI);
      gui.add(cameraYRot.rotation, "y", -Math.PI, Math.PI);
      gui.add(cameraZRot.rotation, "z", -Math.PI, Math.PI);
      // lightingFolder
      //   .add(params, "distance", 0, 1)
      //   .step(0.001)
      //   .onChange((val: number) => {
      //     light.distance = val;
      //   });
      // lightingFolder
      //   .add(params, "focus", 0, 1)
      //   .step(0.001)
      //   .onChange((val: number) => {
      //     light.focus = val;
      //   });

      return gui;
    },
  },
  mounted() {
    this.init();
    this.animate(clock);
  },

  computed: {},
});
</script>
