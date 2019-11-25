<template >
  <div class='sketch-parameter-control'>

    <span>{{ parameter.displayLabel }}</span>

    <v-nus
      v-if="parameter.attrType === 'numeric'"
      :config="{ connect: true, connectColors: ['#b2b2b2', 'red', '#0e83cd', '#b2b2b2'], range: { min: [0], max: [100], }, tooltips: true,}"
      :value="[this.parameter.min, this.parameter.currentValue, this.parameter.max]"
      @update="values = $event"
     />
  </div>

</template>

<script>
export default {
  data: () => ({}),

  props: {
    sketchSelected: {},
    parameter: {
      type: Object,
    },
  },

};
</script>
