<template lang="pug">

  .three-tut-wrapper
    Navigation()
    h1 Three test
    #threejs-renderer


</template>

<script>
import * as THREE from 'three';
import Navigation from '@/components/Navigation';

export default {
  data: () => ({
    scene: null,
    camera: null,
    renderer: null,
    objects: {},
    ADD: -0.04,
  }),

  components: {
    Navigation,
  },

  methods: {
    // set up the environment -
    // initiallize scene, camera, objects and renderer
    init() {
      // 1. create the scene
      // ....
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x000000);
      // 2. create and locate the camera
      // ....
      this.camera = new THREE.PerspectiveCamera(
        30,
        window.innerWidth / window.innerHeight,
        1,
        1000,
      );
      this.camera.position.z = 10;
      // 3. create and locate the objects on the scene
      // ...

      this.scene.add(new THREE.AxesHelper(5));

      // this.createCube();
      this.createSphere();
      this.createTorus();
      // 4. create the renderer
      // ...
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      const renderingElem = document.getElementById('threejs-renderer');
      renderingElem.appendChild(this.renderer.domElement);
    },

    createCube() {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00a1cb });
      const cube = new THREE.Mesh(geometry, material);

      this.objects.cube = cube;
      this.scene.add(cube);
    },

    createSphere() {
      const geometry = new THREE.SphereGeometry(1, 30, 30, 0, Math.PI, 0, Math.PI / 2);
      const material = new THREE.MeshBasicMaterial({ color: 0x000ff88, wireframe: true });
      const sphere = new THREE.Mesh(geometry, material);

      this.objects.sphere = sphere;
      this.scene.add(sphere);
    },

    createTorus() {
      const geometry = new THREE.TorusGeometry(2, 0.5, 20, 20, 2 * Math.PI);
      const material = new THREE.MeshBasicMaterial({ color: 0xff55ee, wireframe: true });
      const torus = new THREE.Mesh(geometry, material);

      this.objects.torus = torus;
      this.scene.add(torus);
    },

    moveSphere() {
      const sphere = this.objects.sphere || null;
      if (!sphere) reutrn;

      sphere.rotation.y += this.ADD;

      if (sphere.position.y <= -3 || sphere.position.y >= 3) {
        this.ADD *= -1;
      }
    },

    moveCube() {
      const cube = this.objects.cube || null;
      if (!cube) return;

      cube.rotation.y -= this.ADD;
      // cube.position.x += this.ADD;

      if (cube.position.x <= -3 || cube.position.x >= 3) {
        this.ADD *= -1;
      }
    },

    moveTorus() {
      const torus = this.objects.torus || null;
      if (!torus) return;

      torus.rotation.y += this.ADD - 0.005;
      torus.rotation.x += this.ADD;

      // cube.position.x += this.ADD;

      if (torus.position.x <= -3 || torus.position.x >= 3) {
        this.ADD *= -1;
      }
    },

    // main animation loop - calls every 50-60 ms.
    mainLoop() {
      this.moveCube();
      this.moveSphere();
      this.moveTorus();

      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(this.mainLoop);
    },
  },

  mounted() {
    this.init();
    this.mainLoop();
  },
};
</script>

<style lang="scss" scoped></style>
