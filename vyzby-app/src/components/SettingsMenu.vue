<template lang="pug">

  v-card#control-panel(
    dark
  )
    #master-controls-container
      v-list-item( to="/")
        v-icon home
      v-divider
      CompositionControls
      v-divider
      LayerSelector(
        :layers="compositionLayers"
      )
      v-divider

    #layer-controls-container
      h3 Layer Controls
      LayerControllerCategories


</template>

<script>
import CompositionControls from '@/components/CompositionControls.vue';
import LayerControllerCategories from '@/components/LayerControllerCategories.vue';
import LayerSelector from '@/components/LayerSelector.vue';


export default {
  components: {
    CompositionControls,
    LayerControllerCategories,
    LayerSelector,
  },
  data: () => ({
    compositionLayers: 3,
  }),
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
  border-radius: 0;
}

#master-controls-container {
  background-color: #424242;
  width: 60px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

#master-controls-container, #layer-controls-container {
  display: inline-block;
  vertical-align: top;
}

#layer-controls-container {
  width: 300px;

  h3 {
    text-align: center;
    border-bottom: 1px solid #fff;
  }
}

#layer-control-menu {
  background-color: #000000bd;
  overflow-y: scroll;
  border-right: 1px solid #292929;
}


</style>
