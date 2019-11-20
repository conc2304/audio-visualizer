<template lang="pug">
  div#visualizer-wrapper
    #sketch-container
    SettingsMenu
</template>

<script>
import SettingsMenu from '@/components/SettingsMenu.vue';
import Visualizer from '@/js/sketches/SketchBaseVisualizer';

export default {
  name: 'visualizer',
  data: () => ({
    menuOpen: true,
  }),
  components: {
    SettingsMenu,
  },
  methods: {},
  mounted() {
    const P5 = require('p5');
    new P5(Visualizer, 'sketch-container');
  },
};
</script>

<style lang="scss" scoped>
#visualizer-wrapper {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
  background-color: #000;
}

* {
  font-family: 'Montserrat', sans-serif;
}

#settings-open {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 24px;
  color: #ffffff;
  padding: 15px;
  float: left;
}
</style>
