<template lang="pug">

  v-card#control-panel(
    class="mx-auto"
    dark
  )
    #master-controls-container()
      v-list-item( to="/")
        v-icon home
      v-divider
      CompositionControls

    #layer-controls-container
      LayerControlProperties

</template>

<script>
import CompositionControls from '@/components/CompositionControls.vue';
import LayerControlProperties from '@/components/LayerControlProperties.vue';

export default {
  components: {
    CompositionControls,
    LayerControlProperties,
  },
  data: () => ({}),
};
</script>

<style lang="scss" scoped>

#control-panel {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background-color: #000000bd;
  overflow: hidden;
  border-right: 1px solid #292929;
}

#master-controls-container {
  background-color: #424242;
  width: 56px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

#master-controls-container, #layer-controls-container {
  display: inline-block;
  vertical-align: top;
}

#layer-controls-container {
  width: 400px;
}

#layer-control-menu {
  background-color: #000000bd;
  overflow-y: scroll;
  border-right: 1px solid #292929;
}
</style>
