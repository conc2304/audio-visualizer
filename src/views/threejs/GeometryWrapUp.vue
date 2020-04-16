<template lang="pug">
  #threejs-tut-wrapper
    Navigation( :navType='navType')
    h1 Geometry Wrap Up

    #threeJS-canvas
</template>

<script>
import * as THREE from 'three';
import Navigation from '@/components/Navigation';
import { FontLoader } from 'three';

let scene, camera, renderer, frustum;
const cubes = []

const sceneInit = () => {
  const limit = 69;
  let i = 0;

  while (i < limit) {
    createCube();
    i++;
  }
};

const animate = (time) => {
  cubes.forEach((c, i) => {
    // console.log(c.speed);
    c.position.y -= c.speed;
    c.position.z += c.speed * 1.2;

    const rDirection = (c.position.x < 0) ? 1 : -1;
    c.rotation.z += c.speed * 0.2 * rDirection;


    const pos = new THREE.Vector3(c.position.x, c.position.y, c.position.z);
    if (!frustum.containsPoint(pos)) {
      // console.log('disposal');
      scene.remove(c);
      cubes.splice(i, 1);
      createCube();
    }
  });
};

const createCube = () => {
  const radius = randomInRange(1, 8);
  const geometry = new THREE.BoxGeometry(radius, radius, radius);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false });
  const cube = new THREE.Mesh(geometry, material);

  cube.speed = randomInRange(0.01, 0.1);
  cube.position.x = randomInRange(-70, 75);
  if (cube.position.x < 0) {
  }
  cube.position.y = randomInRange(20, 80);
  cube.position.z = randomInRange(30, -100);

  scene.add(cube);
  cubes.push(cube);
};

const randomInRange = (from, to) => {
  const x = Math.random() * (to - from);
  return x + from;
};

export default {
  data: () => ({
    navType: 'threejs',
  }),

  components: {
    Navigation,
  },

  methods: {
    init() {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
      // scene.add(new THREE.AxesHelper(10));

      const fov = 70;
      const aspect = window.innerWidth / window.innerHeight;
      const near = 10;
      const far = 1000;
      camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      camera.position.z = 100;

      camera.updateMatrix();
      camera.updateMatrixWorld();
      frustum = new THREE.Frustum();
      frustum.setFromProjectionMatrix(
        new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse),
      );

      sceneInit();

      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);

      const canvas = document.getElementById('threeJS-canvas');
      canvas.appendChild(renderer.domElement);
    },

    draw(time) {
      time *= 0.001;

      animate(time);

      renderer.render(scene, camera);
      requestAnimationFrame(this.draw);
    },
  },

  mounted() {
    this.init();
    this.draw();
  },
};
</script>
