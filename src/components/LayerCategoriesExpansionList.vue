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

          v-expansion-panel-header.category-name  {{ category }}
            template( v-slot:actions)
              v-icon expand_more
          v-expansion-panel-content
            LayerParameterControls(
              :RegisteredSketches="RegisteredSketches"
              :category="category"
              :auxInputVisible="auxInputVisible"
              :categoryIndex="i"
            )

</template>

<script>
import LayerParameterControls from "@/components/LayerParameterControls.vue";

export default {
  name: "LayerControllerCategories",
  components: {
    LayerParameterControls,
  },

  data: () => ({}),

  props: {
    RegisteredSketches: {
      type: Array,
    },
    auxInputVisible: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    updateConfigs() {
      this.RegisteredSketches = this.RegisteredSketches;
    },

    getPropertyCategories(layerIndex) {
      const categories = [];
      const currentSketch = this.RegisteredSketches[layerIndex];

      for (const property in currentSketch) {
        if (!currentSketch.hasOwnProperty(property)) {
          continue;
        }
        const category = currentSketch[property].category;
        if (category && !categories.includes(category)) {
          categories.push(category);
        }
      }

      return categories;
    },
  },

  computed: {
    sketchIndexSelected() {
      return this.$store.state.sketchIndexSelected;
    },
  },
};
</script>

<style lang="scss" scoped>
// add the slider css here
#controller-property-categories {
  width: 100%;
  height: 100vh;
  padding-bottom: 150px;
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

.category-name {
  font-weight: 600;
}
</style>

<style lang="scss">
#controller-property-categories {
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    background-color: #000;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #000000bd;
    background-image: -webkit-gradient(
      linear,
      40% 0%,
      75% 84%,
      from(#000000bd),
      to($color-secondary-blue),
      color-stop(0.9, $color-primary-blue)
    );
  }
}
</style>
