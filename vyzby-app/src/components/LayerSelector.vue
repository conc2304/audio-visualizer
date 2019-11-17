<template lang="pug">
  #layer-selector
    p Layers

    v-list( dense nav)
      v-list-item(
        v-for="(layer, i) in layers"
        :key="i"
        @click=""
      )
        v-icon.menu-icon filter_{{ i+1 }}
</template>

<script>
export default {
  props: {
    layers: {
      type: Number,
    },
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

i.menu-icon.inactive {
  color: $color-inactive-red-hover;
}

i.menu-icon.inactive:hover {
  color: $color-inactive-red
}

i.menu-icon:hover {
  color: $color-secondary-blue;
}
</style>
