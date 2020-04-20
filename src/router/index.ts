import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";

import SplashScreen from "@/views/HomePage.vue";
import Visualizer from "@/views/VisualizerPage.vue";


Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: "/",
    name: "Home",
    component: SplashScreen,
  },

  // {
  //   path: "/",
  //   name: "OG-Home",
  //   component: Home,
  // },

  {
    path: "/playground",
    name: "playground",
    component: Visualizer,
  },
  {
    path: "/home",
    name: "OG-Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
