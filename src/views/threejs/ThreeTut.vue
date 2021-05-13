<template lang="pug">
  #three-tut-wrapper
    h1 New Tutorial

    #threeJS-canvas
</template>

<script lang="ts">
import Vue from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

const assetPath = "../../assets-tutorial/";

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let cube: THREE.Mesh;
let controls: OrbitControls;
let light: THREE.AmbientLight;

export default Vue.extend({
  components: {},
  data: () => ({}),
  methods: {
    init() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
      );
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);

      const canvas = document.getElementById("threeJS-canvas");
      canvas?.appendChild(renderer.domElement);

      light = new THREE.AmbientLight(0x404040);
      scene.add(light);
      light.position.z = 100;

      controls = new OrbitControls(camera, renderer.domElement);

      const mtlLoader = new MTLLoader();
      mtlLoader.setPath(assetPath);
      mtlLoader.load(
        "r2-d2.mtl",
        (materialCreator: MTLLoader.MaterialCreator): void => {
          console.log(mtlLoader.path);
          materialCreator.preload();
          const objLoader = new OBJLoader();
          objLoader.setMaterials(materialCreator);
          objLoader.setPath(assetPath);
          objLoader.load("r2-d2.obj", (group: THREE.Group): void => {
            scene.add(group);
            group.position.y += 0;
          });
        },
      );
      // this.creaeteCube();
    },

    creaeteCube() {
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
      });
      cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
    },

    animate() {
      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;
      requestAnimationFrame(this.animate);
      renderer.render(scene, camera);
    },

    draw(time: number) {
      time *= 0.001;
      this.animate();
    },
  },
  mounted() {
    this.init();
    this.animate();
    // this.draw();
  },
  computed: {},
});
</script>

<style lang="scss" scoped></style>
