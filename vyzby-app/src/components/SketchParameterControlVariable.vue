<template lang="pug">
  .sketch-parameter-control

    v-radio-group(
      v-if="parameter.attrType === 'variable'"
      v-model="parameter.currentValue"
      row
      dark
    )
      v-radio(
        v-for="(option, i) in parameter.options"
        :label="parameter.options[i]"
        :value="parameter.options[i]"
        :key="i"
      )
</template>

<script>
export default {
  data: () => ({
  }),

  props: {
    parameter: {
      type: Object,
    },
  },

  mounted() {
    console.log(this.parameter);
    this.parameterValue = this.parameter.currentValue;
    for (let options in this.parameter.options) {
      console.log(options);
    }
  },
};
</script>

<style lang="scss" scoped></style>
