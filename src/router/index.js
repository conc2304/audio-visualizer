import Vue from 'vue';
import VueRouter from 'vue-router';
import SplashScreen from '@/views/HomePage.vue'
import ThreePage from '@/views/Three.vue'
import Visualizer from '@/views/VisualizerPage.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: SplashScreen,
  },
  {
    path: '/three',
    name: 'Three',
    component: ThreePage,
  },
  {
    path: '/playground',
    name: 'Playground',
    component: Visualizer,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
