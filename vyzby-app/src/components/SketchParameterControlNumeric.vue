<template lang="pug">
  .sketch-parameter-control

    p {{ parameter.displayLabel }}

    v-nus(
      v-if="parameter.attrType === 'numeric' && config && value"
      :config="config"
      :value="value"
      @update="values = $event"
    )
</template>

<script>
export default {
  data: () => ({
    config: false,
    value: false,
  }),

  props: {
    sketchSelected: {},
    parameter: {
      type: Object,
    },
  },

  mounted() {
    this.config = {
      connect: [false, true, true, false],
      connectColors: ["#0e83cd", "#0e83cd"],
      start: [this.parameter.min, this.parameter.currentValue, this.parameter.max],
      range: {
        min: [this.parameter.defaultMin],
        max: [this.parameter.defaultMax],
      },
      tooltips: true,
    };
    this.value = [this.parameter.min, this.parameter.currentValue, this.parameter.max];
  },
};
</script>
