<template lang="pug">
  .audio-parameter-wrapper

    .knob-wrapper
      v-tooltip( bottom)
        template( v-slot:activator="{ on }")
          .tooltip-wrapper( v-on="on")
            KnobControl(
              v-on="on"
              v-if="parameter.audio && gain"
              :min="0"
              :max="100"
              :size="40"
              primary-color="#0eb1ff"
              secondary-color="#0e83cd"
              text-color="#FFFFFF"
              v-model="gain"
            )
        span Gain
    .select-wrapper
      v-tooltip( bottom)
        template( v-slot:activator="{ on }")
          .tooltip-wrapper( v-on="on")
            v-select(
              :items="frequencies"
              item-text="label"
              item-value="ranges"
              v-model="freqRangeSelected"
              label="Select Audio Range"
              clearable=true
              color="#0e83cd"
              return-object
              outlined
              single-line
              dense
            )
        span Make parameter react to audio frequency

</template>

<script>
import KnobControl from 'vue-knob-control';

export default {
  data: () => ({
    gain: false,
    freqRangeSelected: {},
    defaultSelect: {},

    frequencies: [
      {
        label: 'Low',
        rangesData: [[1, 140]],
        ranges: '1 - 140 Hz',
      },
      {
        label: 'Mid - Low',
        rangesData: [[140, 400]],
        ranges: '140 - 400 Hz',
      },
      {
        label: 'Mid',
        rangesData: [[400, 2600]],
        ranges: '400 - 2600 Hz',
      },
      {
        label: 'Mid - High',
        rangesData: [[2600, 5200]],
        ranges: '2600 - 5200 Hz',
      },
      {
        label: 'High',
        rangesData: [[5200, 14000]],
        ranges: '5200 - 14000 Hz',
      },
    ],
  }),

  components: {
    KnobControl,
  },

  props: {
    parameter: {
      type: Object,
    },
  },

  mounted() {
    let gain = this.parameter.audio.gain;
    this.gain = gain * 100;
  },

  watche: {
    gain(newValue, oldValue) {

    }
  }
};
</script>

<style lang="scss" scoped>
.audio-parameter-wrapper {
  display: flex;
}

.knob-wrapper {
  margin-right: 15px;
}

.select-wrapper {
  flex-grow: 1;

  .v-label {
    font-size: 10px;
  }
}

</style>

<style lang="scss">
.select-wrapper .v-select__slot .v-label{
  font-size: 12px;
}
</style>
