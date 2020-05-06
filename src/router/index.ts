import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import SplashScreen from "@/views/HomePage.vue";
import Visualizer from "@/views/VisualizerPage.vue";
// ThreeJS Tutorials
import GeometryWrapUp from "@/views/threejs/GeometryWrapUp.vue";
import NormalMaterials from "@/views/threejs/NormalMaterials.vue";
import DepthMaterials from "@/views/threejs/DepthMaterials.vue";
import LightSensitiveMaterials from "@/views/threejs/LightSensitiveMaterials.vue";

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
    path: "/threejs/normal-materials",
    name: "Normal Materials",
    component: NormalMaterials,
  },
  {
    path: "/threejs/depth-materials",
    name: "Depth Materials",
    component: DepthMaterials,
  },
  {
    path: "/threejs/light-sensitive-materials",
    name: "Light Sensitive Materials",
    component: LightSensitiveMaterials,
  }
];

const Router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default Router;
