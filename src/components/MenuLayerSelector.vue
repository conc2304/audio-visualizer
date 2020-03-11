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
            v-for="(sketch, key, index) in RegisteredSketches"
            :key="index"
            :class="{ 'active': sketchIndexSelected === key, 'inactive': sketch.bypass }"
            @click="selectLayer(key)"
          )
            v-icon.menu-icon filter_{{ index + 1 }}

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
import KeyboardControlsService from '@/js/services/KeyboardControlsService';
import AudioPlayerService from '@/js/services/AudioPlayerService';

export default {
  data: () => ({
    layerDashVisible: true,
  }),

  props: {
    RegisteredSketches: {
      type: Object,
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

    removeSketch() {
      let layerSelected = this.sketchIndexSelected;
      if (layerSelected == null || layerSelected < 0) {
        return;
      }

      KeyboardControlsService.deleteLayerMapping(this.RegisteredSketches[layerSelected].sid);
      AudioPlayerService.deleteLayerMapping(this.RegisteredSketches[layerSelected].sid);

      delete this.RegisteredSketches[layerSelected];
      if (!Object.keys(this.RegisteredSketches)[0]) {
        this.$store.commit('updateLayerMenuOpen', false);
        this.$store.commit('updateSketchIndexSelected', -1);
      } else {
        this.selectLayer(Object.keys(this.RegisteredSketches)[0]);
      }
    },
  },

  created() {
    console.log(typeof this.RegisteredSketches);
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
  max-height: 50%;
  overflow-y: scroll;
}
</style>
