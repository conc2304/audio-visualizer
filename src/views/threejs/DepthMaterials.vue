<template lang="pug">
  ThreeJsCanvasWrapper( :pageTitle="'Depth Materials'")
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ThreeJsCanvasWrapper from "@/components/ThreeJsCanvasWrapper.vue";

import * as THREE from "three";
import { getRandomInt } from "@/js/services/Utils2";

@Component({
  components: {
    ThreeJsCanvasWrapper,
  },
})
export default class DepthMaterials extends Vue {
  constructor() {
    super();
  }

  // PROPS

  // COMPONENT DATA

  // LIFECYCLE HOOKS
  mounted(): void {
    this.init();
    this.draw(0);
  }
  created(): void {}
  beforeUpdate(): void {}

  // PRIVATE PROPERTIES
  private camera!: THREE.PerspectiveCamera;
  private scene: THREE.Scene = new THREE.Scene();
  private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
  private frustum: THREE.Frustum = new THREE.Frustum();

  private cube1!: THREE.Object3D;
  private cube2!: THREE.Object3D;
  private cylinder!: THREE.Object3D;
  private sphere1!: THREE.Object3D;
  private sphere2!: THREE.Object3D;
  private particles!: THREE.Object3D;

  // PRIVATE METHODS
  private sceneInit(): void {
    this.createGeometry();
  }

  private init(): void {
    this.scene.background = new THREE.Color(0x0011df);

    const fov = 70;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 10;
    const far = 1000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.z = 100;

    this.camera.updateMatrix();
    this.camera.updateMatrixWorld();
    this.frustum.setFromProjectionMatrix(
      new THREE.Matrix4().multiplyMatrices(
        this.camera.projectionMatrix,
        this.camera.matrixWorldInverse,
      ),
    );

    this.sceneInit();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const canvas = <HTMLElement>document.getElementById("threejs-canvas");
    canvas.appendChild(this.renderer.domElement);
  }

  private createGeometry(): void {
    const cubeGeometry = new THREE.BoxGeometry(15, 10, 20);
    const sphereGeometry = new THREE.SphereGeometry(10);
    const cylinderGeometry = new THREE.CylinderGeometry(5, 10, 25, 25, 25);
    const depthMaterial = new THREE.MeshDepthMaterial();
    const lineMaterial = new THREE.LineDashedMaterial({
      color: 0xffffff,
      linewidth: 1,
      dashSize: 2,
      gapSize: 3,
    });
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0x008cbf,
      size: 10,
      sizeAttenuation: false,
    });
    // const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 });

    this.cube1 = new THREE.Mesh(cubeGeometry, depthMaterial);
    this.cube1.position.x = -20;
    this.cube1.position.z = -100;
    this.scene.add(this.cube1);

    this.cube2 = new THREE.Points(cubeGeometry, pointsMaterial);
    this.cube2.position.x = -20;
    this.cube2.position.z = -100;
    this.scene.add(this.cube2);

    this.sphere1 = new THREE.Mesh(sphereGeometry, depthMaterial);
    this.sphere1.position.x = 20;
    this.sphere1.position.z = 50;
    this.scene.add(this.sphere1);

    this.sphere2 = new THREE.Points(sphereGeometry, pointsMaterial);
    this.sphere2.position.x = 20;
    this.sphere2.position.z = 50;
    this.scene.add(this.sphere2);

    // cylinderGeometry.computeLineDistances();
    this.cylinder = new THREE.Line(cylinderGeometry, lineMaterial);
    this.cylinder.position.x = 0;
    this.cylinder.position.z = 40;
    this.scene.add(this.cylinder);

    const particleGeometry = new THREE.Geometry();
    for (let i = 0; i < 1000; i ++) {
      const x = getRandomInt(-25, 25);
      const y = getRandomInt(-25, 25);
      const z = getRandomInt(-25, 25);
      particleGeometry.vertices.push(new THREE.Vector3(x, y, z));
    }
    this.particles = new THREE.Points(particleGeometry, pointsMaterial);
    this.scene.add(this.particles);

  }

  private animate(time: number): void {
    const velocity = 0.4;
    const distance = 80;

    this.cube1.position.z = Math.sin(time * velocity) * distance;
    this.sphere1.position.z = Math.sin(time * velocity) * distance;
    this.cube2.position.z = Math.cos(time * velocity) * distance;
    this.cube2.rotation.y = -time * 0.8;

    this.sphere2.position.z = Math.cos(time * velocity) * distance;
    this.sphere2.rotation.y = time * 0.8;
    this.cylinder.position.z = Math.cos(time * velocity) * distance;
    this.cylinder.rotation.x = time * 0.8;
  }

  private draw(time: number) {
    time *= 0.001;

    this.animate(time);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.draw);
  }
}
</script>
