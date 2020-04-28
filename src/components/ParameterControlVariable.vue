<template lang="pug">
  .sketch-parameter-control

    .parameter-title-bar
      p {{ parameter.displayLabel }}

      .parameter-icon-wrapper
        ParameterLockToggle(
          :parameter="parameter"
        )

    v-radio-group(
      v-if="parameter.attrType === 'variable'"
      v-model="parameter.currentValue"
      :disabled='parameter.lockOn'
      row
    )
      v-radio(
        v-for="(option, i) in parameter.options"
        :label="parameter.options[i]"
        :value="parameter.options[i]"
        :key="i"
        color="color_secondary_blue"
        on-icon="radio_button_checked"
        off-icon="radio_button_unchecked"
      )
</template>

<script>
import ParameterLockToggle from "@/components/ParameterLockToggle.vue";

export default {
  data: () => ({
    parameterValue: null,
  }),

  components: {
    ParameterLockToggle,
  },

  props: {
    parameter: {
      type: Object,
    },
  },

  mounted() {
    this.parameterValue = this.parameter.currentValue;
  },
};
</script>

<style lang="scss">
.sketch-parameter-control {
  .theme--.v-icon {
    color: $color-primary-blue;
  }

  .parameter-title-bar {
    margin: 2rem 0 1.2rem;

    p {
      margin-bottom: 0;
      display: inline-block;
    }
  }

  .parameter-icon-wrapper {
    float: right;
  }
}
</style>
