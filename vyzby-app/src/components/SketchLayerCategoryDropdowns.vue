<template lang="pug">

  #controller-property-categories

    .layer-wrapper(
      v-for="(layer, layerIndex) in RegisteredSketches"
      v-show="layerIndex === sketchIndexSelected"
      :key="layerIndex"
    )

      LayerControlDashboard(
        :sketchIndexSelected="sketchIndexSelected"
        :RegisteredSketches="RegisteredSketches"
        @layer_action_triggered="updateConfigs"
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
import LayerControlDashboard from '@/components/LayerControlDashboard.vue';

export default {
  name: 'LayerControllerCategories',
  components: {
    SketchLayerParameterControls,
    LayerControlDashboard,
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
