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
            :key="sketch.sid"
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
import {
  UPDATE_SKETCH_INDEX_SELECTED,
  UPDATE_LAYER_MENU_OPEN,
  UPDATE_CATALOGUE_OPEN,
  UPDATE_AUDIO_PLAYER_OPEN,
  UPDATE_REGISTERED_SKETCHES,
} from '../store/mutationTypes';
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
      this.$store.commit(UPDATE_SKETCH_INDEX_SELECTED, layerIndex);
      this.$store.commit(UPDATE_LAYER_MENU_OPEN, true);
      this.$store.commit(UPDATE_CATALOGUE_OPEN, false);
      this.$store.commit(UPDATE_AUDIO_PLAYER_OPEN, false);
    },

    addNewSketch() {
      this.$store.commit(UPDATE_CATALOGUE_OPEN, true);
      this.$store.commit(UPDATE_LAYER_MENU_OPEN, false);
      this.$store.commit(UPDATE_AUDIO_PLAYER_OPEN, false);
      this.$store.commit(UPDATE_SKETCH_INDEX_SELECTED, -1);
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
      const layerSelectedID = this.RegisteredSketches[this.sketchIndexSelected]
        .sid;

      console.log(layerSelectedID);

      if (layerSelected == null || layerSelected < 0) {
        return;
      }

      const updatedSketches = this.RegisteredSketches.filter(sketchItem => {
        return sketchItem.sid !== layerSelectedID;
      });

      this.$store.commit(UPDATE_REGISTERED_SKETCHES, updatedSketches);

      const nextLayer = this.RegisteredSketches.length > 0 ? 0 : null;
      this.selectLayer(nextLayer);
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

  .v-list-item--disabled i,
  .v-list-item--disabled i .v-icon {
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
