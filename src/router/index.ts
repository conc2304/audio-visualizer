import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import SplashScreen from "@/views/HomePage.vue";
import Visualizer from "@/views/VisualizerPage.vue";
import GeometryWrapUp from "@/views/threejs/GeometryWrapUp.vue";

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
  {
    path: "/threejs/geometry-wrap-up",
    name: "geometry wrap up",
    component: GeometryWrapUp,
  }
];

const Router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default Router;
