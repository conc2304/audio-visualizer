<template lang="pug">
  .sketch-parameter-control

    p.parameter-title {{ parameter.displayLabel }}

    v-radio-group(
      v-if="parameter.attrType === 'variable'"
      v-model="parameter.currentValue"
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
export default {
  data: () => ({
    parameterValue: null,
  }),

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
}
</style>
