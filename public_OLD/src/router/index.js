import Vue from 'vue';
import VueRouter from 'vue-router';
import SplashScreen from '@/views/HomePage.vue'
import About from '@/views/About.vue'
import Visualizer from '@/views/VisualizerPage.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: SplashScreen,
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
  {
    path: '/playground',
    name: 'playground',
    component: Visualizer,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
