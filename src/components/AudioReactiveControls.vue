<template lang="pug">
  .audio-parameter-wrapper()
    v-icon.input-type() music_note
    .knob-wrapper
      v-tooltip(
        :disabled="parameter.lockOn"
        bottom
      )
        template( v-slot:activator="{ on }")
          .tooltip-wrapper( v-on="on")
            // implementation of vue-knob-control
            KnobControl(
              v-on="on"
              v-if="parameter.audio && gain >= 0 && gain !== false"
              :min="0"
              :max="100"
              :size="40"
              primary-color="#0eb1ff"
              secondary-color="#0e83cd"
              text-color="#FFFFFF"
              v-model="gain"
              :disabled='parameter.lockOn'
            )
        span Gain
    .freq-select-wrapper
      v-tooltip(
        :disabled="parameter.lockOn"
        bottom
      )
        template( v-slot:activator="{ on }")
          .tooltip-wrapper( v-on="on")
            v-select(
              :items="frequencies"
              item-text="label"
              item-value="ranges"
              :disabled='parameter.lockOn'
              v-model="freqRangeSelected"
              label="Audio Range"
              clearable
              clear-icon="close"
              color="#0e83cd"
              return-object
              outlined
              single-line
              dense
            )
        span Make parameter react to audio frequency
</template>

<script>
import KnobControl from "vue-knob-control";
import APS from "@/js/services/AudioPlayerService";
import RegisteredSketches from "@/js/services/SketchRegistration";

export default {
  data: () => ({
    gain: false,
    freqRangeSelected: {},
    defaultSelect: {},
    frequencies: APS.frequencies,
  }),

  components: {
    KnobControl,
  },

  props: {
    parameter: {
      type: Object,
    },
    parameterIndex: {
      type: Number,
    },
    categoryIndex: {
      type: Number,
    },
  },

  methods: {
    selectAudioFrequency() {
      APS.setAudioReactiveFreq(
        this.freqRangeSelected,
        this.parameter.attrName,
        this.selectedSketchIndex
      );
    },
  },

  mounted() {
    this.gain = this.parameter.audio.gain * 100;

    if (
      this.selectedSketchIndex === 0 &&
      this.categoryIndex === 0 &&
      this.parameterIndex === 0
    ) {
      this.freqRangeSelected = APS.frequencies[2];
    }
  },

  watch: {
    gain(newValue, oldValue) {
      RegisteredSketches[this.selectedSketchIndex][
        this.parameter.attrName
      ].audio.gain = newValue && newValue !== oldValue ? newValue * 0.01 : 0.5;
    },

    freqRangeSelected(newValue, oldValue) {
      APS.setAudioReactiveFreq(
        newValue,
        this.parameter.attrName,
        this.selectedSketchIndex
      );
    },
  },

  computed: {
    selectedSketchIndex() {
      return this.$store.state.sketchIndexSelected;
    },
  },
};
</script>

<style lang="scss" scoped>
.audio-parameter-wrapper {
  display: flex;
}

.knob-wrapper {
  margin-right: 15px;
}

.freq-select-wrapper {
  flex-grow: 1;

  .v-label {
    font-size: 10px;
  }
}
.input-type {
  color: $color-off-white;
  margin-right: 8px;
}
</style>

<style lang="scss">
.select-wrapper .v-select__slot .v-label {
  font-size: 12px;
}
.freq-select-wrapper .v-input__control {
  height: 40px;
}
</style>
