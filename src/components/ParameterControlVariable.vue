<template lang="pug">
  .sketch-parameter-control
    .parameter-title-bar
      p {{ parameter.displayLabel }}

      .parameter-icon-wrapper
        ParameterLockToggle(
          :parameter="parameter"
        )

    v-select(
      outlined
      hide-selected
      :items="parameter.options"
      v-model="parameter.currentValue"
      single-line
      dense
      color="#0e83cd"
    )
</template>

<script>
import ParameterLockToggle from '@/components/ParameterLockToggle.vue';

export default {
  components: {
    ParameterLockToggle,
  },

  props: {
    parameter: {
      type: Object,
    },
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
