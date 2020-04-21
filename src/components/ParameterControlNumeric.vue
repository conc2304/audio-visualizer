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
                  :class="{ 'off': !KeyboardInputVisible && !auxInputVisible }"
                ) keyboard
              span {{ KeyboardInputVisible ? 'Hide' : 'Show' }} Keyboard Controller

          v-tooltip( right)
              template( v-slot:activator = "{ on }")
                v-icon.menu-icon(
                  @click="AudioInputVisible = !AudioInputVisible"
                  v-on="on"
                  :class="{ 'off': !AudioInputVisible && !auxInputVisible }"
                ) music_note
              span {{ AudioInputVisible ? 'Hide' : 'Show' }} Audio controller
        ParameterLockToggle(
          :parameter="parameter"
        )

    .controller-wrapper
      // implementation of vue-nouislider-fork
      .slider-wrapper(
        :class="{ 'color-slider' : parameter.displayLabel.includes('Color'), 'saturation-slider' : parameter.displayLabel.includes('Saturation') }"
      )
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
import AudioReactiveControls from "@/components/AudioReactiveControls.vue";
import ParameterLockToggle from "@/components/ParameterLockToggle.vue";
import ParameterKeyboardInputFields from "@/components/ParameterKeyboardInputFields.vue";

export default {
  // Note:
  // This is an implementation of noUiSlider ported to vue via https://www.npmjs.com/package/vue-nouislider-fork/v/1.0.8

  data: () => ({
    sliderConfig: false,
    sliderValues: false,
    AudioInputVisible: false,
    KeyboardInputVisible: false,
  }),

  components: {
    AudioReactiveControls,
    ParameterKeyboardInputFields,
    ParameterLockToggle,
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
  },

  methods: {
    getParameterAttributes() {
      this.sliderConfig = {
        connect: [false, true, true, false],
        connectColors: ["color_primary_blue", "color_primary_blue"],
        start: [
          this.parameter.min,
          this.parameter.currentValue,
          this.parameter.max,
        ],
        range: {
          min: [this.parameter.defaultMin],
          max: [this.parameter.defaultMax],
        },
        tooltips: true,
      };
      this.sliderValues = [
        this.parameter.min,
        this.parameter.currentValue,
        this.parameter.max,
      ];
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

.parameter-title-bar {
  margin: 2rem 0 0;

  p {
    margin-bottom: 0;
    display: inline-block;
  }
}
.slider-wrapper {
  margin-bottom: 40px; // hight of the tooltip
}
.aux-input-toggler {
  display: inline;
  i {
    padding-right: 0.4rem;
  }
}

.off {
  color: $color-std-grey;
}
</style>

<style lang="scss">
.slider-wrapper {
  .noUi-tooltip {
    border-radius: 0 50% 50%;
  }
  .noUi-horizontal .noUi-tooltip {
    bottom: initial;
    top: 32px;

    &::after {
      background-color: black;
      position: absolute;
      bottom: 37px;
      -webkit-transform: rotate(-45deg);
      transform: rotate(-45deg);
      right: 33px;
      font-size: 0.9rem;
      padding: 2px 5px;
      border-radius: 2px;
    }
  }

  .noUi-base :nth-child(2) .noUi-tooltip::after {
    content: "min";
  }

  .noUi-base :nth-child(4) .noUi-tooltip::after {
    content: "max";
  }

  .noUi-handle-draggable-tooltip-overlay {
    top: 22px;
  }

  &.color-slider .noUi-connects::after {
    content: "";
    background: linear-gradient(
      to right,
      red,
      orange,
      yellow,
      lime,
      cyan,
      cyan,
      blue,
      indigo,
      magenta,
      red
    );
    width: 100%;
    height: 2px;
    position: absolute;
    z-index: 2;
  }

  &.saturation-slider .noUi-connects::after {
    content: "";
    background: linear-gradient(to right, white, $color-primary-blue);
    width: 100%;
    height: 2px;
    position: absolute;
    z-index: 2;
  }
}
</style>
