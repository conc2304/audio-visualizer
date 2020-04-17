<template lang="pug">
  #layer-selector.menu-dash-group
    v-tooltip( right)
      template( v-slot:activator= "{ on }")
        v-list-item.no-padding(
          @click="layerDashVisible = !layerDashVisible"
        )
          p(
            v-on="on"
          ) Layers
      span {{ layerDashVisible ? 'Hide' : 'Show' }} Layer Selectors

    #layer-dash-buttons(
      v-show="layerDashVisible"
    )
      v-list( dense nav)

        .layer-selector-wrapper( class="custom-thin-scrollbar")
          v-list-item(
            v-for="(sketch, i) in RegisteredSketches"
            :key="i"
            :class="{ 'active': sketchIndexSelected === i, 'inactive': sketch.bypass }"
            @click="selectLayer(i)"
          )
            v-icon.menu-icon filter_{{ i+1 }}

        .layer-arrangement
          v-tooltip( right)
            template( v-slot:activator= "{ on }")
              v-list-item(
                @click="removeSketch()"
                :disabled="sketchIndexSelected == null || sketchIndexSelected < 0"
              )
                v-icon(
                  v-on="on"
                ) remove
            span  Remove Selected Layer

          v-tooltip( right)
            template( v-slot:activator= "{ on }")
              v-list-item(
                @click="addNewSketch()"
              )
                v-icon(
                  v-on="on"
                ) add
            span  Add New Sketch

        .layer-arrangement( v-if="false")
          v-list-item(
            @click="sketchOrderShift(1)"
            :disabled="!sketchIndexSelected"
          )
            v-icon keyboard_arrow_up
          v-list-item(
            @click="sketchOrderShift(-1)"
            :disabled="sketchIndexSelected + 1 === 3"
          )
            v-icon keyboard_arrow_down


</template>

<script>
export default {
  data: () => ({
    layerDashVisible: true,
  }),

  props: {
    RegisteredSketches: {
      type: Array,
    },
    menuOpen: {
      type: Boolean,
    },
  },

  methods: {
    selectLayer(layerIndex) {
      this.layerSelected = layerIndex;
      this.$store.commit('updateSketchIndexSelected', layerIndex);
      this.$store.commit('updateLayerMenuOpen', true);
      this.$store.commit('updateCatalogueOpen', false);
      this.$store.commit('updateAudioPlayerOpen', false);
    },

    addNewSketch() {
      this.$store.commit('updateCatalogueOpen', true);
      this.$store.commit('updateLayerMenuOpen', false);
      this.$store.commit('updateAudioPlayerOpen', false);
      this.$store.commit('updateSketchIndexSelected', -1);
    },

    sketchOrderShift(deltaPos) {
      this.RegisteredSketches = array_move(
        this.RegisteredSketches,
        this.layerSelected,
        this.layerSelected + deltaPos,
      );

      function array_move(arr, old_index, new_index) {
        if (new_index >= arr.length) {
          let k = new_index - arr.length + 1;
          while (k--) {
            arr.push(undefined);
          }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr; // for testing
      }
    },

    removeSketch() {
      const layerSelected = this.sketchIndexSelected;
      if (layerSelected == null || layerSelected < 0) {
        return;
      }

      this.RegisteredSketches.splice(layerSelected, 1);
      this.selectLayer(0);
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
.layer-arrangement {
  text-align: center;
  .v-list-item {
    width: 20px;
    height: 10px;
    display: inline-block;
    padding: 0;
  }

  .v-list-item--disabled i {
    color: #777;
  }

  .v-icon {
    font-size: 20px;
    padding-top: 10px;
  }
}
.layer-selector-wrapper {
  max-height: 150px;
  overflow-y: scroll;
}
</style>
