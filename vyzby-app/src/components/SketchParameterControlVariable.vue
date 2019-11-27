<template lang="pug">
  .sketch-parameter-control

    v-radio-group(
      v-if="parameter.attrType === 'variable'"
      v-model="parameterValue"
      row
      dark
    )
      v-radio(
        v-for="(option, i) in parameter.options"
        :label="option"
        :value="option"
        color="#0e83cd"
        dark
        :key="i"
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
    console.log(this.parameter);
    this.parameterValue = this.parameter.currentValue;
  },
};
</script>

<style lang="scss" scoped></style>
