<template lang="pug">
  v-app
    v-content
      SplashScreen
</template>

<script>
import SplashScreen from '@/components/SplashScreen.vue';

export default {
  name: 'App',
  components: {
    SplashScreen,
  },
  data: () => ({
  }),
  events: {
  },
};
</script>

<style lang="scss" scoped>
</style>
