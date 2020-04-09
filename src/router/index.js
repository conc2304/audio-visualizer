import Vue from 'vue';
import VueRouter from 'vue-router';
import SplashScreen from '@/views/HomePage.vue';
import ThreePage from '@/views/Three.vue';
import Visualizer from '@/views/VisualizerPage.vue';
import DonutRain from '@/views/DonutRain.vue';
import Saturn from '@/views/Saturn.vue';

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
    path: '/donut-rain',
    name: 'Donut Rain',
    component: DonutRain,
  },
  {
    path: '/saturn',
    name: 'Saturn',
    component: Saturn,
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
