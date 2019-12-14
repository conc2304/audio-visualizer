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

        .layer-selector-wrapper( class="custom-thin-scrollbar")
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
    dialog: false,
    layerSelected: null,
    layerAddEnabled: true,
    numSketches: 0,
    layerDashVisible: true,
  }),

  props: {
    RegisteredSketches: {
      type: Array,
    },
    menuOpen: {
      type: Boolean,
    },
    sketchIndexSelected: {
      default: null,
    },
  },

  methods: {
    selectLayer(layerIndex) {
      this.layerSelected = layerIndex;
      this.$emit('layer_selected', layerIndex);
    },

    addNewSketch() {
      this.$emit('catalogue_open', true);
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
  },

  watch: {
    sketchIndexSelected(newVal, oldVal) {
      this.layerSelected = newVal;
    },
  },

  mounted() {
    this.numSketches = this.RegisteredSketches.length;
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
