<template lang="pug">
  .sketch-parameter-control

    p.parameter-title {{ parameter.displayLabel }}

    .controller-wrapper
      // implementation of vue-nouislider-fork
      v-nus(
        v-if="parameter.attrType === 'numeric' && sliderConfig && sliderValues"
        :config="sliderConfig"
        :value="sliderValues"
        @update="updateSliderValues($event)"
      )

      ParameterKeyboardInputFields(
        v-show="auxInputVisibible"
        :parameter="parameter"
      )
      AudioReactiveControls(
        v-show="parameter.audio && auxInputVisibible"
        :parameter="parameter"
        :auxInputVisibible="auxInputVisibible"
      )
</template>

<script>
import AudioReactiveControls from '@/components/AudioReactiveControls.vue';
import ParameterKeyboardInputFields from '@/components/ParameterKeyboardInputFields.vue';

export default {
  // Note:
  // This is an implementation of noUiSlider ported to vue via https://www.npmjs.com/package/vue-nouislider-fork/v/1.0.8

  data: () => ({
    sliderConfig: false,
    sliderValues: false,
  }),

  components: {
    AudioReactiveControls,
    ParameterKeyboardInputFields,
  },

  props: {
    parameter: {
      type: Object,
    },
    auxInputVisibible: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    getParameterAttributes() {
      this.sliderConfig = {
        connect: [false, true, true, false],
        connectColors: ['color_primary_blue', 'color_primary_blue'],
        start: [this.parameter.min, this.parameter.currentValue, this.parameter.max],
        range: {
          min: [this.parameter.defaultMin],
          max: [this.parameter.defaultMax],
        },
        tooltips: true,
      };
      this.sliderValues = [this.parameter.min, this.parameter.currentValue, this.parameter.max];
    },

    updateSliderValues(event) {
      this.parameter.min = event[0];
      this.parameter.targetValue = event[1];
      this.parameter.max = event[2];
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
    },
  },
};
</script>

<style lang="scss" scoped>
.controller-wrapper {
  margin-left: 1rem;
  .noUi-target {
    margin-bottom: 1rem !important;
  }
}
</style>
