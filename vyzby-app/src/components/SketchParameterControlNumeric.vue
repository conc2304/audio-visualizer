<template lang="pug">
  .sketch-parameter-control

    p {{ parameter.displayLabel }}

    .controller-wrapper
      v-nus(
        v-if="parameter.attrType === 'numeric' && sliderConfig && sliderValues"
        :config="sliderConfig"
        :value="sliderValues"
        @update="sliderValues = $event"
      )

      AudioReactiveControls(
        v-if="parameter.audio && audioEnabled"
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
    sliderValues: false,
    audioEnabled: true,
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

  methods: {
    getParameterAttributes() {
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
      this.sliderValues = [this.parameter.min, this.parameter.currentValue, this.parameter.max];
    },
  },

  mounted() {
    this.getParameterAttributes();
  },

  watch: {
    sketchSelected(newValue, oldValue) {
      this.getParameterAttributes();
    },
    sliderValues(newValue, oldValue) {
      this.parameter.min = newValue[0];
      this.parameter.targetValue = newValue[1];
      this.parameter.max = newValue[2];
    }
  },
};
</script>

<style lang="scss" scoped>
.controller-wrapper {
  margin-left: 15px;
}
</style>
