<template lang="pug">
  div#visualizer-wrapper
    #sketch-container
    SketchMenu
</template>

<script>
import SketchMenu from '@/components/SketchMenu.vue';
import Visualizer from '@/js/sketches/SketchBaseVisualizer';
import RegisteredSketches from '@/js/services/SketchRegistration';
import KeyboardControlsService from '@/js/services/KeyboardControlsService';
import Utils from '@/js/services/Utils';

export default {
  name: 'visualizer',
  data: () => ({
    menuOpen: true,
  }),
  components: {
    SketchMenu,
  },
  methods: {},
  mounted() {
    const P5 = require('p5');
    new P5(Visualizer, 'sketch-container');

    // alphabet charcodes fo A-Z = [65 - 90]
    // number 0-1 = [49 - 57]

    // TODO figure out how to have this happen on page load and not component load
    let randomCharCode;
    for (let index in RegisteredSketches) {
      for (let prop in RegisteredSketches[index]) {
        if (!RegisteredSketches[index][prop].hasOwnProperty('defaultValue')) {
          continue;
        }

        let keyboardCharacter;
        if (Utils.getRandomInt(0, 10) < 4) {
          keyboardCharacter = Utils.getRandomInt(49, 57);
        } else {
          keyboardCharacter = Utils.getRandomInt(65, 90);
        }

        keyboardCharacter = String.fromCharCode(keyboardCharacter);
        let min = parseFloat(RegisteredSketches[index][prop].min);
        let max = parseFloat(RegisteredSketches[index][prop].max);

        let rValue = Number((Math.random() * (max - min + min)).toFixed(4));

        KeyboardControlsService.setKeyboardControl(keyboardCharacter, rValue, prop, index);
      }
    }
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
  color: $color-off-white;
  padding: 15px;
  float: left;
}
</style>
