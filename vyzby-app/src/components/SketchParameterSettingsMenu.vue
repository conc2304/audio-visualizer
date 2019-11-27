<template lang="pug">
  #settings-menubar

    v-card#control-panel(
      dark
    )

      #master-controls-container
        v-list-item( to="/")
          v-icon.off-white home

        v-divider
        SketchLayerSelector(
          :RegisteredSketches="RegisteredSketches"
          :menuOpen="menuOpen"
          v-on:layer_selected="updatesketchIndexSelected"
        )
        v-divider
        SketchCompositionDashboard

        v-divider

      #layer-controls-container( v-if="menuOpen")
        .layer-control-header
          h3 Layer {{ sketchIndexSelected + 1 }} Controls
          v-list-item.close( @click="closeMenu")
            v-icon.off-white close
        SketchParamaterCategoryDropdown(
          :sketchIndexSelected="sketchIndexSelected"
          :RegisteredSketches="RegisteredSketches"
        )

</template>

<script>
import SketchCompositionDashboard from '@/components/SketchCompositionDashboard.vue';
import SketchParamaterCategoryDropdown from '@/components/SketchParamaterCategoryDropdown.vue';
import SketchLayerSelector from '@/components/SketchLayerSelector.vue';

import RegisteredSketches from '@/js/services/SketchRegistration';

export default {
  components: {
    SketchCompositionDashboard,
    SketchParamaterCategoryDropdown,
    SketchLayerSelector,
  },
  data: () => ({
    menuOpen: false,
    RegisteredSketches,
    sketchIndexSelected: null,
  }),

  methods: {
    updatesketchIndexSelected(sketchIndexSelected) {
      this.menuOpen = true;
      this.sketchIndexSelected = sketchIndexSelected;
    },

    closeMenu() {
      this.sketchIndexSelected = -1;
      this.menuOpen = false;
    },
  },
};
</script>

<style lang="scss" scoped>
$subtle-border: rgba(255, 255, 255, 0.12);

#control-panel {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background-color: $color-transparent-black;
  overflow: hidden;
  border-right: 1px solid $color-std-grey;
  border-radius: 0;
}

#master-controls-container {
  position: relative;
  background-color: $color-std-grey;
  width: 60px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

i.off-white {
  color: $color-off-white;
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
  border-right: 1px solid $subtle-border;
}

#toggle-layer-controls-container {
  position: absolute;
  top: 0;
  left: 60px;
  background-color: $color-std-grey;
  border-left: 1px solid $subtle-border;
  border-radius: 0 10px 10px 0;
  i {
    color: $color-off-white;
  }
}

.layer-control-header {
  position: relative;
  height: 49px;
  border-bottom: 1px solid $color-std-grey;

  .close {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
  }
}
</style>
