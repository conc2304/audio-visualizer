<template lang="pug">
  .sketch-parameter-control

    p {{ parameter.displayLabel }}

    v-nus(
      v-if="parameter.attrType === 'numeric' && sliderConfig && sliderValue"
      :config="sliderConfig"
      :value="sliderValue"
      @update="values = $event"
    )

    AudioReactiveControls(
      v-if="parameter.audio"
      :parameter="parameter"
    )

</template>

<script>
import AudioReactiveControls from '@/components/SketchParameterControlAudio.vue';

export default {
  // Note:
  // This is an implementation of noUiSlider ported to vue via https://www.npmjs.com/package/vue-nouislider-fork/v/1.0.8

  data: () => ({
    sliderConfig: false,
    sliderValue: false,
  }),

  components: {
    AudioReactiveControls,
  },

  props: {
    sketchSelected: {},
    parameter: {
      type: Object,
    },
  },

  mounted() {
    this.sliderConfig = {
      connect: [false, true, true, false],
      connectColors: ['#0e83cd', '#0e83cd'],
      start: [this.parameter.min, this.parameter.currentValue, this.parameter.max],
      range: {
        min: [this.parameter.defaultMin],
        max: [this.parameter.defaultMax],
      },
      tooltips: true,
    };
    this.sliderValue = [this.parameter.min, this.parameter.currentValue, this.parameter.max];
  },
};
</script>
