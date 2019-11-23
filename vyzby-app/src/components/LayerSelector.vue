<template lang="pug">
  #layer-selector
    p Layers

    v-list( dense nav)
      v-list-item.add-sketch(@click="addNewSketch"  v-if="layerAddEnabled")
        v-icon library_add
      v-list-item(
        v-for="(sketch, i) in registeredSketches"
        :key="i"
        :class="{ 'layer-selected': layerSelected === i, 'layer-inactive': sketch.bypass }"
        @click="selectLayer(i)"
      )
        v-icon.menu-icon filter_{{ i+1 }}
      #layer-arrangement
        v-list-item(
          @click="sketchOrderShift(1)"
          v-if="layerAddEnabled"
          :disabled="layerSelected === 0"
        )
          v-icon keyboard_arrow_up
        v-list-item(
          @click="sketchOrderShift(-1)"
          v-if="layerAddEnabled"
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
    registeredSketches: {
      type: Array,
    },
  },

  methods: {
    selectLayer(layerIndex) {
      this.layerSelected = layerIndex;
      console.log(`Layer Selected ${layerIndex}`);
      this.$emit('layer_selected', this.registeredSketches[layerIndex]);
    },

    addNewSketch() {
      console.log('show pop up with sketches');
    },

    sketchOrderShift(deltaPos) {
      console.log(deltaPos);
      this.registeredSketches[this.layerSelected];

      this.registeredSketches = array_move(
        this.registeredSketches,
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
  },

  mounted() {
    this.numSketches = this.registeredSketches.length;
  },
};
</script>

<style lang="scss" scoped>
#layer-selector {
  margin: 45px auto;

  p {
    width: auto;
    margin: 0 auto;
    text-align: center;
  }
}

i.menu-icon {
  color: $color-primary-blue;
  cursor: pointer;
}

i.menu-icon:hover {
  color: $color-secondary-blue;
}

.layer-selected {
  border: 1px solid $color-secondary-blue;
}

.layer-inactive {
  i {
    color: $color-inactive-red;

    &:hover {
      color: $color-inactive-red-hover;
    }
  }
}

#layer-arrangement {
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
