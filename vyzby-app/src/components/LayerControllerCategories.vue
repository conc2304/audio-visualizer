<template lang="pug">

  #controller-property-categories
    v-expansion-panels( accordion focusable=false)
      v-expansion-panel(
        v-for="(category, i) in propertyCategories"
        :key="i"
      )
        v-expansion-panel-header.layer-name  {{category }}
          template( v-slot:actions)
            v-icon expand_more
        v-expansion-panel-content  actual controls
</template>

<script>
export default {
  name: 'LayerControllerCategories',
  components: {},
  data: () => ({
    propertyCategories: [],
  }),

  props: {
    sketchSelected: {
      type: Object,
    },
  },

  watch: {
    sketchSelected(newValue, oldValue) {
      this.propertyCategories = this.getPropertyCategories();
    }
  },

  methods: {
    getPropertyCategories() {
      let categories = [];
      for (let property in this.sketchSelected) {
        const category = this.sketchSelected[property].category;
        if (category && !categories.includes(category)) {
          categories.push(category);
        }
      }

      return categories;
    },
  },

  mounted() {
    this.propertyCategories = this.getPropertyCategories();
  },
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
