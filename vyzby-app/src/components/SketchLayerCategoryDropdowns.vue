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
            SketchLayerParameterControls(
              :sketchIndexSelected="sketchIndexSelected"
              :RegisteredSketches="RegisteredSketches"
              :category="category"
            )

</template>

<script>
import SketchLayerParameterControls from '@/components/SketchLayerParameterControls.vue';

export default {
  name: 'LayerControllerCategories',
  components: {
    SketchLayerParameterControls,
  },

  data: () => ({}),

  props: {
    sketchIndexSelected: {
      type: Number,
    },
    RegisteredSketches: {
      type: Array,
    },
  },

  watch: {},

  methods: {
    updateConfigs() {
      this.RegisteredSketches = this.RegisteredSketches;
      console.log('test');
    },

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

  mounted() {},

  watch: {},
};
</script>

<style lang="scss" scoped>
// add the slider css here
#controller-property-categories {
  width: 100%;
  height: 100vh;
  padding-bottom: 400px;
  overflow-y: scroll;

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
