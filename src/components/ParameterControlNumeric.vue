<template lang="pug">
  .sketch-parameter-control

    .parameter-title-bar
      p {{ parameter.displayLabel }}
      .parameter-icon-wrapper
        .aux-input-toggler
          v-tooltip( right)
              template( v-slot:activator = "{ on }")
                v-icon.menu-icon(
                  @click="KeyboardInputVisible = !KeyboardInputVisible"
                  v-on="on"
                  :class="{ 'off': !KeyboardInputVisible }"
                ) keyboard
              span {{ KeyboardInputVisible ? 'Hide' : 'Show' }} Keyboard Controller

          v-tooltip( right)
              template( v-slot:activator = "{ on }")
                v-icon.menu-icon(
                  @click="AudioInputVisible = !AudioInputVisible"
                  v-on="on"
                  :class="{ 'off': !AudioInputVisible }"
                ) music_note
              span {{ AudioInputVisible ? 'Hide' : 'Show' }} Audio controller
        ParameterLockToggle(
          :parameter="parameter"
        )

    .controller-wrapper
      // implementation of vue-nouislider-fork
      v-nus(
        v-if="parameter.attrType === 'numeric' && sliderConfig && sliderValues"
        :config="sliderConfig"
        :value="sliderValues"
        @update="updateSliderValues($event)"
        :disabled='parameter.lockOn'
      )



      ParameterKeyboardInputFields(
        v-show="auxInputVisible || KeyboardInputVisible"
        :parameter="parameter"
      )

      AudioReactiveControls(
        v-show="parameter.audio && (auxInputVisible || AudioInputVisible)"
        :parameter="parameter"
        :auxInputVisible="auxInputVisible"
        :parameterIndex="parameterIndex"
        :categoryIndex="categoryIndex"
      )
</template>

<script>
import AudioReactiveControls from '@/components/AudioReactiveControls.vue';
import ParameterLockToggle from '@/components/ParameterLockToggle.vue';
import ParameterKeyboardInputFields from '@/components/ParameterKeyboardInputFields.vue';
// import ParameterAuxFieldShortCuts from '@/components/ParameterAuxFieldShortCuts.vue';

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
    ParameterLockToggle,
    // ParameterAuxFieldShortCuts,
  },

  props: {
    parameter: {
      type: Object,
    },
    auxInputVisible: {
      type: Boolean,
      default: false,
    },
    parameterIndex: {
      type: Number,
    },
    categoryIndex: {
      type: Number,
    },
    AudioInputVisible: {
      type: Boolean,
    },
    KeyboardInputVisible: {
      type: Boolean,
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
.parameter-icon-wrapper {
float: right;
}

.aux-input-toggler {
  display: inline;
  i {
    padding-right: 0.4rem;
  }
}

p {
  display: inline-block;
}
.off {
  color: $color-std-grey;
}
</style>
