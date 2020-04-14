import Vue from 'vue';
import VueRouter from 'vue-router';
import SplashScreen from '@/views/HomePage.vue';
import ThreePage from '@/views/threejs/Three.vue';
import Visualizer from '@/views/VisualizerPage.vue';
import DonutRain from '@/views/threejs/DonutRain.vue';
import Saturn from '@/views/threejs/Saturn.vue';
import CustomGeo from '@/views/threejs/CustomGeo.vue';
import TextGeometry from '@/views/threejs/TextGeometry.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: SplashScreen,
  },
  {
    path: '/threejs/basic-geometry',
    name: 'Basic Geometry',
    component: ThreePage,
  },
  {
    path: '/threejs/donut-rain',
    name: 'Donut Rain',
    component: DonutRain,
  },
  {
    path: '/threejs/saturn',
    name: 'Saturn',
    component: Saturn,
  },
  {
    path: '/playground',
    name: 'Playground',
    component: Visualizer,
  },

  {
    path: '/threejs/custom-geo',
    name: 'Custom Geometry',
    component: CustomGeo,
  },

  {
    path: '/threejs/text-geo',
    name: 'Text Geometry',
    component: TextGeometry,
  },

];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
