<template lang="pug">
  .saturn-tut-wrapper
    Navigation
    h1 Saturn
    #threeJS-canvas
</template>

<script>
import * as THREE from 'three';
import Navigation from '@/components/Navigation';

let scene;
let camera;
let renderer;
let rings = {
  velocity: 0.001,
  instances: [],
}

const createPlanet = (options = {}) => {
  const { radius, x, y, z } = options;
  const geometry = new THREE.SphereGeometry(radius, 30, 30);
  const material = new THREE.MeshBasicMaterial({ color: 0x000ff88, wireframe: false });
  const sphere = new THREE.Mesh(geometry, material);

  sphere.position.x = x || 0;
  sphere.position.y = y || 0;
  sphere.position.z = z || 0;
  scene.add(sphere);
};

const createRing = (options = {}) => {
  const { radius, tilt, x, y, z } = options;
  const ringWidth = Math.random() * (radius * 0.4 - radius * 0.1);
  const geometry = new THREE.TorusGeometry(radius, ringWidth, 2, 30);
  const material = new THREE.MeshBasicMaterial({ color: 0x0dffe6, wireframe: true });
  const ring = new THREE.Mesh(geometry, material);

  ring.position.x = x || 0;
  ring.position.y = y || 0;
  ring.position.z = z || 0;

  ring.rotation.x = 2;
  ring.rotation.y = 0.185;

  scene.add(ring);
  rings.instances.push(ring);
};

const createSaturn = () => {
  const r = 0.3;

  createPlanet({ radius: r, x: 0, y: 0, z: 0 });

  const numRings = 3;

  for (let i = 0; i < numRings; i++) {
    createRing({ radius: r * (2 + i), x: 0, y: 0, z: 0 });
  }
};

const animateRings = () => {
  rings.instances.forEach(
    ring => {
      ring.rotation.z += rings.velocity;
    });
}

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  controls.handleResize();
  render();
};

export default {
  data: () => ({}),

  components: {
    Navigation,
  },

  methods: {
    init() {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
      scene.add(new THREE.AxesHelper(5));

      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);

      createSaturn();

      const renderElem = document.getElementById('threeJS-canvas');
      renderElem.appendChild(renderer.domElement);

      window.addEventListener('resize', onWindowResize, false);
    },

    mainLoop() {
      renderer.render(scene, camera);
      requestAnimationFrame(this.mainLoop);
      animateRings();
    },
  },

  mounted() {
    this.init();
    this.mainLoop();
  },
};
</script>
