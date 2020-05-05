import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import SplashScreen from "@/views/HomePage.vue";
import Visualizer from "@/views/VisualizerPage.vue";
// ThreeJS Tutorials
import GeometryWrapUp from "@/views/threejs/GeometryWrapUp.vue";
import Materials01 from "@/views/threejs/Materials01.vue";

Vue.use(VueRouter);

export const routes: RouteConfig[] = [
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
  // ThreeJS Tutorials
  {
    path: "/threejs/geometry-wrap-up",
    name: "geometry wrap up",
    component: GeometryWrapUp,
  },
  {
    path: "/threejs/Materials01",
    name: "Materials 01",
    component: Materials01,
  }
];

const Router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default Router;
