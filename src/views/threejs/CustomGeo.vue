<template lang="pug">
  #donut-rain-wrapper
    Navigation( :navType='navType')
    h1 Custom Geometry

    #threeJS-canvas
</template>

<script></script>

<script>
import * as THREE from 'three';
import Navigation from '@/components/Navigation';

let scene = null;
let camera = null;
let renderer = null;
let shape = null;
let initialY = null;
let initialX = null;

const addCustomGeo = () => {
  const geometry = new THREE.Geometry();

  geometry.vertices.push(new THREE.Vector3(0, 0, 0));
  geometry.vertices.push(new THREE.Vector3(5, 2, 0));
  geometry.vertices.push(new THREE.Vector3(-1, 5, -6));
  geometry.vertices.push(new THREE.Vector3(-1, 5, 6));
  // geometry.vertices.push(new THREE.Vector3(1, 2, -2));

  geometry.faces.push(new THREE.Face3(0, 1, 2));
  geometry.faces.push(new THREE.Face3(0, 1, 3));

  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: false,
  });

  shape = new THREE.Mesh(geometry, material);
  shape.rotation.y = 0.5 * Math.PI;

  scene.add(shape);
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
      // create the scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x111111);
      scene.add(new THREE.AxesHelper(5));

      // create and place camera
      const fov = 30;
      const aspect = window.innerWidth / window.innerHeight;
      const near = 1;
      const far = 1000;
      camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      camera.position.z = 55;

      addCustomGeo();

      // create renderer
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);

      const renderElem = document.getElementById('threeJS-canvas');
      renderElem.appendChild(renderer.domElement);
    },

    render(time) {
      time *= 0.0051;
      // shape.rotation.x = time;
      shape.rotation.y = time * 0.1;
      // shape.rotation.z = 2 * Math.PI * Math.cos(time);

      if (!initialY && !initialX && shape.geometry.vertices[2].y && shape.geometry.vertices[3].y) {
        initialY = shape.geometry.vertices[2].y || shape.geometry.vertices[3].y;
        initialX = shape.geometry.vertices[2].x || shape.geometry.vertices[3].x;
      }

      let addY = 2 * Math.sin(time) - 4;
      let addX = Math.sin(time) - 2;
      // let add = Math.sin(time );
      if (time && true) {
        shape.geometry.vertices[2].y = initialY + addY;
        shape.geometry.vertices[3].y = initialY + addY;
        shape.geometry.vertices[3].x = initialX - addX;
        shape.geometry.vertices[3].x = initialX - addX;
      }
      shape.geometry.verticesNeedUpdate = true;

      renderer.render(scene, camera);
      requestAnimationFrame(this.render);
    },
  },

  mounted() {
    this.init();
    this.render();
  },
};
</script>
