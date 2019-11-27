<template lang="pug">

  #controller-property-categories

    .layer-wrapper(
      v-for="(layer, layerIndex) in RegisteredSketches"
      v-show="layerIndex === sketchIndexSelected"
      :key="layerIndex"
    )

      v-expansion-panels( accordion focusable=true)
        v-expansion-panel(
          v-for="(category, i) in getPropertyCategories(layerIndex)"
          :key="i"
        )
          v-expansion-panel-header.layer-name  {{ category }}
            template( v-slot:actions)
              v-icon expand_more
          v-expansion-panel-content
            SketchParameterCategoryControls(
              :sketchIndexSelected="sketchIndexSelected"
              :RegisteredSketches="RegisteredSketches"
              :category="category"
            )

</template>

<script>
import SketchParameterCategoryControls from '@/components/SketchParameterCategoryControls.vue';

export default {
  name: 'LayerControllerCategories',
  components: {
    SketchParameterCategoryControls,
  },
  data: () => ({
  }),

  props: {
    sketchIndexSelected: {
      type: Number,
    },
    RegisteredSketches: {
      type: Array,
    },
  },

  watch: {
  },

  methods: {
    getPropertyCategories(layerIndex) {
      let categories = [];

      const currentSketch = this.RegisteredSketches[layerIndex];
      for (let property in currentSketch) {
        const category = currentSketch[property].category;
        if (category && !categories.includes(category)) {
          categories.push(category);
        }
      }

      return categories;
    },
  },

  mounted() {
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
