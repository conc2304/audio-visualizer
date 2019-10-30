<template>
  <v-app>
    <v-content>
      <HelloWorld v-if="location ==='home'"/>
      <SplashScreen v-if="location === 'splash'"/>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';
import SplashScreen from './components/SplashScreen.vue';

export default {
  name: 'App',
  components: {
    HelloWorld,
    SplashScreen,
  },
  data: () => ({
    location: 'splash',
  }),
};
</script>

<style lang="scss" scoped>

</style>
