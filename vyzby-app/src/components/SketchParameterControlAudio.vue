<template lang="pug">
  .audio-parameter-wrapper

    KnobControl(
      v-if="parameter.audio && gain"
      :min="0"
      :max="100"
      :size="40"
      primary-color="#0eb1ff"
      secondary-color="#0e83cd"
      text-color="#FFFFFF"
      v-model="gain"
    )
    p Gain
</template>

<script>
import KnobControl from 'vue-knob-control'

export default {
  data: () => ({
    gain: false
  }),

  components: {
    KnobControl,
  },

  props: {
    parameter: {
      type: Object,
    }
  },

  mounted() {
    let gain = this.parameter.audio.gain;

    this.gain = gain * 100;
    console.log(this.parameter.audio.gain);
    // console.log(this.parameter.audio.gain);
    // this.gain = this.parameter.audio.gain;
  }
}
</script>
