<template lang="pug">
  #settings-menubar

    #toggle-layer-controls-container( v-if="!menuOpen")
      v-card( dark)
        v-list-item( @click="menuOpen = true")
          v-icon menu

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
          :sketches="RegisteredSketches"
          v-on:layer_selected="updateSketchSelected"
        )
        v-divider

      #layer-controls-container( v-if="menuOpen")
        .layer-control-header
          h3 Layer Controls
          v-list-item.close( @click="menuOpen = false")
            v-icon close
        LayerControllerCategories(
          :sketchSelected="sketchSelected"
        )

</template>

<script>
import CompositionControls from '@/components/CompositionControls.vue';
import LayerControllerCategories from '@/components/LayerControllerCategories.vue';
import LayerSelector from '@/components/LayerSelector.vue';

import RegisteredSketches from '@/js/services/SketchRegistration';

export default {
  components: {
    CompositionControls,
    LayerControllerCategories,
    LayerSelector,
  },
  data: () => ({
    compositionLayers: 3,
    menuOpen: false,
    RegisteredSketches,
    sketchSelected : null,
  }),

  methods: {

    updateSketchSelected(sketchSelected) {
      this.menuOpen = true;
      this.sketchSelected = sketchSelected;
    }
  }
};
</script>

<style lang="scss" scoped>
$subtle_boarder: rgba(255, 255, 255, 0.12);
#control-panel {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background-color: #000000bd;
  overflow: hidden;
  border-right: 1px solid $subtle_boarder;
  border-radius: 0;
}

#master-controls-container {
  position: relative;
  background-color: #424242;
  width: 60px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

#master-controls-container,
#layer-controls-container {
  display: inline-block;
  vertical-align: top;
}

#layer-controls-container {
  width: 300px;

  h3 {
    text-align: center;
    line-height: 48px;
  }
}

#layer-control-menu {
  background-color: #000000bd;
  overflow-y: scroll;
  border-right: 1px solid #292929;
}

#toggle-layer-controls-container {
  position: absolute;
  top: 0;
  left: 60px;
  background-color: #424242;
  border-left: 1px solid $subtle_boarder;
  border-radius: 0 10px 10px 0;
  i {
    color: #fff;
  }
}

.layer-control-header {
  position: relative;
  height: 50px;
  border-bottom: 1px solid #fff;

  .close {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
  }
}
</style>
