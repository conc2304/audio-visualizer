<template lang="pug">
  div#visualizer-wrapper
    #sketch-container
    SketchMenu(
      v-show="masterMenuOpen"
    )
    v-icon.master-menu-toggle(
      v-show="!masterMenuOpen"
      @click="updateMasterMenu(true)"
      dark
    ) &#9776;
    AppSettingsMenu
</template>

<script>
import SketchMenu from "@/components/SketchMenu.vue";
import AppSettingsMenu from "@/components/AppSettingsMenu.vue";
import Visualizer from "@/js/sketches/SketchBaseVisualizer";
import RegisteredSketches from "@/js/services/SketchRegistration";
import KeyboardControlsService from "@/js/services/KeyboardControlsService";
import p5 from "p5"; // use this one for instantiation of fft, amplitude ...
import APS from "@/js/services/AudioPlayerService";
import Utils from "@/js/services/Utils";

export default {
  data: () => ({}),

  components: {
    AppSettingsMenu,
    SketchMenu,
  },

  methods: {
    updateMasterMenu(status) {
      this.$store.commit("updateMasterMenuOpen", status);
    },
  },

  computed: {
    masterMenuOpen() {
      return this.$store.state.masterMenuOpen;
    },
  },
  mounted() {
    const sketch = new p5(Visualizer, "sketch-container");

    // alphabet charcodes fo A-Z = [65 - 90]
    // number 0-1 = [49 - 57]
    let demoEqSet = false;
    for (const index in RegisteredSketches) {
      if (!RegisteredSketches.hasOwnProperty(index)) continue;
      for (const prop in RegisteredSketches[index]) {
        if (!RegisteredSketches[index].hasOwnProperty(prop)) continue;
        if (!RegisteredSketches[index][prop].hasOwnProperty("defaultValue")) {
          continue;
        }

        if (!demoEqSet) {
          // APS.setAudioReactiveFreq(APS.frequencies[2], prop, index);
          demoEqSet = true;
        }

        let keyboardCharacter =
          Utils.getRandomInt(0, 10) < 4
            ? Utils.getRandomInt(49, 57)
            : (keyboardCharacter = Utils.getRandomInt(65, 90));

        keyboardCharacter = String.fromCharCode(keyboardCharacter);
        const min = parseFloat(RegisteredSketches[index][prop].min);
        const max = parseFloat(RegisteredSketches[index][prop].max);

        const rValue = Number((Math.random() * (max - min + min)).toFixed(4));

        KeyboardControlsService.setKeyboardControl(
          keyboardCharacter,
          rValue,
          prop,
          index
        );
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

  .master-menu-toggle {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    padding: 1rem;

    &:hover {
      color: $color-secondary-blue;
    }

    &:active {
      color: $color-primary-blue;
    }
  }
}

* {
  font-family: "Montserrat", sans-serif;
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
