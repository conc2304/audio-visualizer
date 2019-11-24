<template lang="pug">
  .sketch-parameter-control

    span {{ parameter.displayLabel }}

    v-nus(
      v-if="parameter.attrType === 'numeric'"
      :config="config"
      :value="values"
      @update="values = $event"
    )

    v-radio-group(
      row
      v-if="parameter.attrType === 'variable'"
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

    v-switch(
      v-if="parameter.attrType === 'boolean'"
    )



</template>

<script>
export default {
  data: () => ({
    config: {
      connect: [true, true, true],
      connectColors: ['blue', 'red', 'orange'],
      range: {
        min: [0],
        max: [100],
      },
    },
    values: [25, 75],
  }),

  props: {
    sketchSelected: {

    },
    parameter: {
      type: Object,
    }
  }
};
</script>
