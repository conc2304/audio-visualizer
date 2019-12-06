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
              :auxInputVisibible="auxInputVisibible"
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
    auxInputVisibible: {
      type: Boolean,
      default: false,
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
      to(#0c6b98),
      color-stop(0.9, #0e83cd)
    );
  }
}
</style>
