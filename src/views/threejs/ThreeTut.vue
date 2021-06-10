<template lang="pug">
  #three-tut-wrapper
    h1 New Tutorialz

    #threeJS-canvas
</template>

<script lang="ts">
import Vue from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";
// import {  } from "three/examples/jsm/helpers;
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";
import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "three/examples/jsm/libs/dat.gui.module";
import { ObjectLoader } from "three";

const assetPath = "../../assets-tutorial/";

let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let camera: THREE.PerspectiveCamera;
let controls: OrbitControls;
let stats: Stats;
// let rectLight: THREE.RectAreaLight;
// let rectLightHelper: RectAreaLightHelper;
let object: THREE.Object3D;
// let pointLight: THREE.PointLight;
let spotLight: THREE.SpotLight;
let lightHelper: THREE.SpotLightHelper;
let shadowCameraHelper;

const clock = new THREE.Clock();

export default Vue.extend({
  components: {},
  data: () => ({}),
  methods: {
    init() {
      scene = new THREE.Scene();
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
      camera.position.set(0, 20, 35);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
      scene.add(ambientLight);
      scene.add(new THREE.DirectionalLight(0xffffff, 1));

      spotLight = new THREE.SpotLight(0xffffff, 1);
      spotLight.position.set(15, 40, 35);
      spotLight.angle = Math.PI / 4;
      spotLight.penumbra = 0.1;
      spotLight.decay = 2;
      spotLight.distance = 200;
      spotLight.castShadow = true;
      spotLight.shadow.mapSize.width = 512;
      spotLight.shadow.mapSize.height = 512;
      spotLight.shadow.camera.near = 10;
      spotLight.shadow.camera.far = 200;
      spotLight.shadow.camera.focus = 1;
      scene.add(spotLight);

      lightHelper = new THREE.SpotLightHelper(spotLight);
      scene.add(lightHelper);

      shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
      scene.add(shadowCameraHelper);

      // RectAreaLightUniformsLib.init();
      // rectLight = new THREE.RectAreaLight(0xffffff, 0, 30, 20);
      // rectLight.position.set(0, 15, 5);
      // rectLight.lookAt(0, 0, 0);
      // scene.add(rectLight);

      // rectLightHelper = new RectAreaLightHelper(rectLight);
      // rectLight.add(rectLightHelper);

      // Floor
      const geoFloor = new THREE.BoxBufferGeometry(2000, 0.1, 2000);
      const matStdFloor = new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0,
        metalness: 0,
      });

      // Objects
      const meshStdFloor = new THREE.Mesh(geoFloor, matStdFloor);
      meshStdFloor.receiveShadow = true;
      scene.add(meshStdFloor);

      const matStdObjects = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0,
        metalness: 0,
      });

      const geoBox = new THREE.BoxBufferGeometry(Math.PI, Math.sqrt(2), Math.E);
      const meshStdBox = new THREE.Mesh(geoBox, matStdObjects);
      meshStdBox.position.set(0, 5, 0);
      meshStdBox.rotation.set(0, Math.PI / 2, 0);
      meshStdBox.castShadow = true;
      meshStdBox.receiveShadow = true;
      scene.add(meshStdBox);

      const geoSphere = new THREE.SphereBufferGeometry(1.5, 32, 32);
      const meshStdSphere = new THREE.Mesh(geoSphere, matStdObjects);
      meshStdSphere.position.set(-5, 5, 0);
      meshStdSphere.castShadow = true;
      meshStdSphere.receiveShadow = true;
      scene.add(meshStdSphere);

      const geoTorus = new THREE.TorusBufferGeometry(1.5, 0.5, 100, 16);
      const meshStdTorus = new THREE.Mesh(geoTorus, matStdObjects);
      meshStdTorus.position.set(5, 5, 0);
      meshStdTorus.castShadow = true;
      meshStdTorus.receiveShadow = true;
      scene.add(meshStdTorus);

      // const loader = new OBJLoader();
      // loader.load("../assets-tutorial/r2-d2.obj", (obj: THREE.Object3D) => {
      //   object = obj;
      //   object.position.y = 20;
      //   let scale = 0.1;
      //   object.scale.set(scale, scale, scale);
      //   object.castShadow = true;
      //   object.receiveShadow = true;
      //   scene.add(object);
      // });

      // Point Light
      // const sphere = new THREE.SphereBufferGeometry(0.5, 16, 8);
      // const sphereMat = new THREE.MeshBasicMaterial({ color: 0xff0040 });
      // const sphereMesh = new THREE.Mesh(sphere, sphereMat);
      // pointLight = new THREE.PointLight(0xff0040, 1, 50);
      // pointLight.position.set(0, 10, -20);
      // pointLight.add(sphereMesh);
      // scene.add(pointLight);

      // Orbit Controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.copy(meshStdBox.position);
      controls.minDistance = 20;
      controls.maxDistance = 500;
      controls.enablePan = false;
      controls.update();

      // Gui
      stats = Stats();
      const gui = new GUI({ width: 300 });
      gui.open();

      const param = {
        motion: true,
        light: true,
        ambient: ambientLight.intensity,
        "object color": matStdObjects.color.getHex(),
        "floor color": matStdFloor.color.getHex(),
        roughness: matStdFloor.roughness,
        metalness: matStdFloor.metalness,

        intensity: spotLight.intensity,
        angle: spotLight.angle,
        penumbra: spotLight.penumbra,
        decay: spotLight.decay,
        distance: spotLight.distance,
        focus: spotLight.shadow.camera.focus,
        // color: rectLight.color.getHex(),
        // intensity: rectLight.intensity,
      };

      gui.add(param, "motion");

      const lightfolder = gui.addFolder("Light");
      lightfolder
        .add(param, "ambient", 0.0, 1)
        .step(0.01)
        .onChange((val: number) => {
          ambientLight.intensity = val;
        });

      lightfolder
        .add(param, "penumbra", 0.0, 1)
        .step(0.01)
        .onChange((val: number) => {
          spotLight.penumbra = val;
        });

      lightfolder
        .add(param, "decay", 0.0, 10)
        .step(0.01)
        .onChange((val: number) => {
          spotLight.decay = val;
        });

      lightfolder
        .add(param, "distance", 0.0, 500)
        .step(0.01)
        .onChange((val: number) => {
          spotLight.distance = val;
        });

      lightfolder
        .add(param, "intensity", 0.0, 1)
        .step(0.01)
        .onChange((val: number) => {
          spotLight.intensity = val;
        });

      lightfolder
        .add(param, "angle", 0.0, 1)
        .step(0.01)
        .onChange((val: number) => {
          spotLight.angle = val;
        });

      lightfolder
        .add(param, "focus", 0.0, 1)
        .step(0.01)
        .onChange((val: number) => {
          spotLight.shadow.camera.focus = val;
        });

      // lightfolder.addColor(param, "color").onChange((val: number) => {
      //   rectLight.color.setHex(val);
      // });

      // lightfolder
      //   .add(param, "intensity", 0.0, 1.0)
      //   .step(0.01)
      //   .onChange((val: number) => {
      //     rectLight.intensity = val;
      //   });

      lightfolder.add(param, "light").onChange((val: number) => {
        ambientLight.intensity = val;
      });

      const standardFolder = gui.addFolder("Standard Materials");
      standardFolder
        .add(param, "metalness", 0.0, 1)
        .step(0.01)
        .onChange((val: number) => {
          matStdObjects.metalness = val;
          matStdFloor.metalness = val;
        });

      standardFolder.addColor(param, "floor color").onChange((val: number) => {
        matStdFloor.color.setHex(val);
      });

      standardFolder
        .add(param, "roughness", 0.0, 1)
        .step(0.01)
        .onChange((val: number) => {
          matStdObjects.roughness = val;
          matStdFloor.roughness = val;
        });
    },

    animate() {
      // rectLightHelper.update();
      const time = Date.now() * 0.0005;
      const delta = clock.getDelta();

      if (object) {
        object.rotation.y *= 1.5 * delta;
      }

      // pointLight.position.y = 15 + Math.sin(time * 0.7) * 30;

      requestAnimationFrame(this.animate);
      stats.begin();
      renderer.render(scene, camera);
      stats.end();
      stats.update();
    },

    draw(time: number) {
      time *= 0.001;
      this.animate();
    },
  },
  mounted() {
    this.init();
    this.animate();
  },
  computed: {},
});
</script>

<style lang="scss" scoped></style>
