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
    console.log('VALUE');
    console.log(this.parameterValue);
    for (let option in this.parameter.options) {
      console.log(this.parameter.options[option]);
    }
  },
};
</script>

<style lang="scss" scoped></style>
