<template lang="pug">
  #donut-rain-wrapper
    Navigation( :navType='navType')
    h1 Donut Rain Tut

    #threeJS-canvas


</template>

<script>
import * as THREE from "three";
import Navigation from "@/components/Navigation";

let scene = null;
let camera = null;
let renderer = null;
const donuts = [];
const velocity = 0.1;

const randomInRange = (from, to) => {
  const x = Math.random() * (to - from);
  return x + from;
};

const createDonut = () => {
  const geometry = new THREE.TorusGeometry(1, 0.5, 5, 30);
  const material = new THREE.MeshBasicMaterial({
    color: Math.random() * 0xff55ee,
  });
  const donut = new THREE.Mesh(geometry, material);

  donut.position.x = randomInRange(-15, 15);
  donut.position.y = randomInRange(10, 15);
  donut.position.z = -15;

  scene.add(donut);
  donuts.push(donut);
};

export default {
  data: () => ({}),

  components: {
    Navigation,
  },

  methods: {
    init() {
      // create the scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0000000);
      scene.add(new THREE.AxesHelper(8));

      // create and place camera
      camera = new THREE.PerspectiveCamera(
        30,
        window.innerWidth / window.innerHeight,
        1,
        1000,
      );
      camera.position.z = 5; // 15
      camera.position.y = 0; // -10

      // create renderer
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);

      const renderElem = document.getElementById("threeJS-canvas");
      renderElem.appendChild(renderer.domElement);
    },

    mainLoop() {
      if (Math.random() < 0.1) {
        createDonut();
      }

      donuts.forEach(d => (d.position.y -= velocity));

      if (donuts.length > 150) {
        donuts.slice(150);
      }
      renderer.render(scene, camera);
      requestAnimationFrame(this.mainLoop);
    },
  },

  mounted() {
    this.init();
    this.mainLoop();
  },
};
</script>
