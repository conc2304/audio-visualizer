import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import SplashScreen from "@/views/HomePage.vue";
import Visualizer from "@/views/VisualizerPage.vue";

import ThreePage from "@/views/threejs/Three.vue";
import DonutRain from "@/views/threejs/DonutRain.vue";
import Saturn from "@/views/threejs/Saturn.vue";
import CustomGeo from "@/views/threejs/CustomGeo.vue";
import TextGeometry from "@/views/threejs/TextGeometry.vue";
import GeometryWrapUp from "@/views/threejs/GeometryWrapUp.vue";
import ThreeTut from "../views/threejs/ThreeTut.vue";
import loader3dm from "@/views/threejs/loader-3dm.vue";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: "/",
    name: "Home",
    component: SplashScreen,
  },
  {
    path: "/playground",
    name: "playground",
    component: Visualizer,
  },
  // threejs
  {
    path: "/threejs/basic-geometry",
    name: "Basic Geometry",
    component: ThreePage,
  },
  {
    path: "/threejs/donut-rain",
    name: "Donut Rain",
    component: DonutRain,
  },
  {
    path: "/threejs/saturn",
    name: "Saturn",
    component: Saturn,
  },
  {
    path: "/threejs/custom-geo",
    name: "Custom Geometry",
    component: CustomGeo,
  },
  {
    path: "/threejs/text-geo",
    name: "Text Geometry",
    component: TextGeometry,
  },
  {
    path: "/threejs/geometry-wrapup",
    name: "Geometry Wrap Up",
    component: GeometryWrapUp,
  },
  {
    path: "/threejs/new-tut",
    name: "New Tut",
    component: ThreeTut,
  },
  {
    path: "/threejs/3dm-loaders",
    name: "3dmLoaders",
    component: loader3dm,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
