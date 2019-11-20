<template lang="pug">
  #layer-selector
    p Layers

    v-list( dense nav)
      v-list-item(
        v-for="(sketch, i) in sketches"
        :key="i"
        :class="{ 'layer-selected': layerSelected === i }"
        @click="selectLayer(i)"
      )
        v-icon.menu-icon filter_{{ i+1 }}
</template>

<script>
export default {
  data: () => ({
    layerSelected: null,
  }),

  props: {
    layers: {
      type: Number,
    },
    sketches: {
      type: Array,
    },
  },

  methods: {
    selectLayer(layerIndex) {
      this.layerSelected = layerIndex;
      console.log(`Layer Selected ${layerIndex}`);
      this.$emit('layer_selected', this.sketches[layerIndex]);
    },
  },

  mounted() {},
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

i.menu-icon.inactive {
  color: $color-inactive-red-hover;
}

i.menu-icon.inactive:hover {
  color: $color-inactive-red;
}

i.menu-icon:hover {
  color: $color-secondary-blue;
}

.layer-selected {
  border: 1px solid $color-active-green;
}
</style>
