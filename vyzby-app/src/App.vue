<template>
  <v-app>
    <v-content>
      <HelloWorld v-if="location ==='main'" />
      <SplashScreen v-if="location === 'splash'" />
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
  events: {
    'loc-change': function (toLocation) {
      this.location = toLocation;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
