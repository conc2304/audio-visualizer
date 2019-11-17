<template lang="pug">

  #controller-property-categories
    v-expansion-panels( accordion focusable="false")
      v-expansion-panel(
        v-for="(item,i) in 5"
        :key="i"
      )
        v-expansion-panel-header.layer-name Group {{ i }}
          template( v-slot:actions)
            v-icon expand_more
        v-expansion-panel-content  actual controls
</template>

<script>
export default {
  name: 'LayerControllerCategories',
  components: {},
  data: () => ({}),
  props: {},
};
</script>

<style lang="scss" scoped>
#controller-property-categories {
  width: 100%;

  .v-expansion-panels {
    background-color: transparent;
    width: 100%;
  }
  .v-expansion-panel {
    background-color: transparent;
  }

  .v-expansion-panel-header {
    border-radius: 0;
  }
}
</style>
