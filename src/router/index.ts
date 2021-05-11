import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import SplashScreen from "@/views/HomePage.vue";
import Visualizer from "@/views/VisualizerPage.vue";
import ThreeTut from "@/views/ThreeTut.vue";

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
  {
    path: "/three",
    name: "three",
    component: ThreeTut,
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
