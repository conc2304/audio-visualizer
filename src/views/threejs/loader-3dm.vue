<template lang="pug">
  #three-tut-wrapper
    h1 3dm Chapter - Three.jsm

    #threeJS-canvas
</template>

<script lang="ts">
import Vue from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Rhino3dmLoader } from "three/examples/jsm/loaders/3DMLoader";
// import { Object3D } from "three";

let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let camera: THREE.PerspectiveCamera;
let controls: OrbitControls;
// let canvas: HTMLCanvasElement;

export default Vue.extend({
  components: {},
  data: () => ({}),
  methods: {
    init() {
      // Scene
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
      camera.lookAt(0, 0, 0);
      scene.add(camera);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
      scene.add(ambientLight);
      scene.add(new THREE.DirectionalLight(0xffffff, 1));

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(0, 0, 2);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      // Orbit Controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, 0);
      controls.update();

      const loader = new Rhino3dmLoader();
      loader.setLibraryPath(
        "https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/",
      );
      loader.load("../assets-tutorial/Rhino_Logo.3dm", obj => {
        const object = obj as THREE.Object3D;
        scene.add(object);
        object.position.set(0, 10, 0);
        object.rotation.z = Math.PI / 2;
      });

      // Floor
      const geoFloor = new THREE.BoxBufferGeometry(2000, 0.1, 2000);
      const matStdFloor = new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0,
        metalness: 0,
      });
      const meshStdFloor = new THREE.Mesh(geoFloor, matStdFloor);
      meshStdFloor.receiveShadow = true;
      scene.add(meshStdFloor);
    },
    animate() {
      const speed = 0.0005;
      const time = Date.now() * speed;

      controls.update();
      renderer.render(scene, camera);

      requestAnimationFrame(this.animate);
    },
  },
  mounted() {
    this.init();
    this.animate();
  },

  computed: {},
});
</script>
