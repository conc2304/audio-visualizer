<template lang="pug">
  #layer-selector
    p Layers

    v-list( dense nav)

      .layer-arrangement
        v-tooltip( right)
          template( v-slot:activator= "{ on }")
            v-list-item(
              @click="removeSketch()"
              :disabled="layerSelected == null || layerSelected < 0"
            )
              v-icon(
                v-on="on"
              ) remove
          span.test  Remove Selected Layer

        v-tooltip( right)
          template( v-slot:activator= "{ on }")
            v-list-item(
              @click="openSketchCatalogue()"
            )
              v-icon(
                v-on="on"
              ) add
          span.test  Add New Sketch

      v-list-item(
        v-for="(sketch, i) in RegisteredSketches"
        :key="i"
        :class="{ 'active': layerSelected === i, 'inactive': sketch.bypass }"
        @click="selectLayer(i)"
      )
        v-icon.menu-icon filter_{{ i+1 }}


      .layer-arrangement( v-if="false")
        v-list-item(
          @click="sketchOrderShift(1)"
          :disabled="!layerSelected"
        )
          v-icon keyboard_arrow_up
        v-list-item(
          @click="sketchOrderShift(-1)"
          :disabled="layerSelected + 1 === 3"
        )
          v-icon keyboard_arrow_down

</template>

<script>
export default {
  data: () => ({
    layerSelected: null,
    layerAddEnabled: true,
    numSketches: 0,
  }),

  props: {
    RegisteredSketches: {
      type: Array,
    },
    menuOpen: {
      type: Boolean
    }
  },

  methods: {
    selectLayer(layerIndex) {
      this.layerSelected = layerIndex;
      this.$emit('layer_selected', layerIndex);
    },

    addNewSketch() {
      console.log('show pop up with sketches');
    },

    sketchOrderShift(deltaPos) {
      this.RegisteredSketches[this.layerSelected];

      this.RegisteredSketches = array_move(
        this.RegisteredSketches,
        this.layerSelected,
        this.layerSelected + deltaPos,
      );

      function array_move(arr, old_index, new_index) {
        if (new_index >= arr.length) {
          var k = new_index - arr.length + 1;
          while (k--) {
            arr.push(undefined);
          }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr; // for testing
      }
    },

    removeSketch() {
      if (this.layerSelected == null || this.layerSelected < 0) {
        return;
      }

      this.RegisteredSketches.splice(this.layerSelected, 1);
      this.selectLayer(0);
    },

    openSketchCatalogue() {
      this.$emit('open_sketch_catalogue', true);
    }
  },

  mounted() {
    this.numSketches = this.RegisteredSketches.length;
  },


};
</script>

<style lang="scss" scoped>
#layer-selector {
  margin: 15px auto;

  p {
    width: auto;
    margin: 0 auto;
    text-align: center;
  }
}

.layer-arrangement {
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
</style>
``
