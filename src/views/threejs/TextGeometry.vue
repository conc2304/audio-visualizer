<template lang="pug">
  #threejs-tut-wrapper
    Navigation( :navType='navType')
    h1 Text Geometry

    #threeJS-canvas
</template>

<script>
import * as THREE from "three";
import Navigation from "@/components/Navigation";
import { FontLoader } from "three";

let scene = null;
let camera = null;
let renderer = null;
let textMesh = null;
// let text = `The dead speak! The galaxy has heard a mysterious broadcast, \n
// a threat of REVENGE in the sinister voice of the late EMPEROR PALPATINE. \n
// GENERAL LEIA ORGANA dispatches secret agents to gather intelligence, \n
// while REY, the last hope of the Jedi, trains for battle against \n
// the diabolical FIRST ORDER. Meanwhile, Supreme Leader KYLO REN \n
// rages in search of the phantom Emperor, determined \n
// to destroy any threat to his power....`;

const loadFont = () => {
  const fontLoader = new THREE.FontLoader();
  fontLoader.load(
    "/assets/fonts/droid/droid_serif_bold.typeface.json",
    font => {
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const textGeometry = new THREE.TextGeometry(test, {
        font,
        size: 2,
        height: 0.1,
      });

      textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.x = -50;
      textMesh.position.z = 1;
      textMesh.rotation.x = -0.5;
      scene.add(textMesh);
    },
  );
};

export default {
  data: () => ({
    navType: "threejs",
  }),

  components: {
    Navigation,
  },

  methods: {
    init() {
      // create scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x111111);
      scene.add(new THREE.AxesHelper(5));

      // create camera
      const fov = 70;
      const aspect = window.innerWidth / window.innerHeight;
      const near = 1;
      const far = 1000;
      camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      camera.position.z = 80;

      loadFont();

      // render it
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);

      const renderElem = document.getElementById("threeJS-canvas");
      renderElem.appendChild(renderer.domElement);
    },

    draw(time) {
      time *= 0.001;

      if (time && textMesh) {
        textMesh.position.z -= time * 0.008;
        textMesh.position.y += time * 0.008;

        if (textMesh.position.y > 200 || textMesh.position.z > 200) {
          textMesh.position.x = -50;
          textMesh.position.z = 1;
        }
      }
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
