<template lang="pug">
  #settings-menubar

    v-card#control-panel(
      dark
    )

      #master-controls-container
        v-list-item( to="/")
          v-icon.off-white home

        v-divider
        SketchMenuLayerSelector(
          :RegisteredSketches="RegisteredSketches"
          :menuOpen="menuOpen"
          @layer_selected="updatesketchIndexSelected"
        )
        v-divider
        SketchMenuCompositionControls(
          v-on:toggle_aux_input="toggleAuxInputFields"
        )

        v-divider

        #audio-player-toggle-wrapper
          v-divider
          v-list( dense nav)
            v-list-item(
              :class="{ 'active': audioPlayerOpen }"
              @click="audioPlayerOpen = !audioPlayerOpen"
            )
              v-icon.menu-icon music_note

      #layer-controls-container( v-show="menuOpen")
        .layer-control-header
          .layer-control-title
            h3 Layer {{ sketchIndexSelected + 1 }} Controls
            v-list-item.close( @click="closeMenu")
              v-icon.off-white close

          LayerControlDashboard(
            :sketchIndexSelected="sketchIndexSelected"
            :RegisteredSketches="RegisteredSketches"
          )

        .layer-control-contents

          SketchLayerCategoryDropdowns(
            :sketchIndexSelected="sketchIndexSelected"
            :RegisteredSketches="RegisteredSketches"
            :auxInputVisibible="auxInputVisibible"
          )

    AudioPlayer(
      v-show="audioPlayerOpen"
    )

</template>

<script>
import SketchMenuLayerSelector from '@/components/SketchMenuLayerSelector.vue';
import SketchMenuCompositionControls from '@/components/SketchMenuCompositionControls.vue';
import SketchLayerCategoryDropdowns from '@/components/SketchLayerCategoryDropdowns.vue';
import LayerControlDashboard from '@/components/LayerControlDashboard.vue';
import AudioPlayer from '@/components/AudioPlayer.vue';

import RegisteredSketches from '@/js/services/SketchRegistration';

export default {
  components: {
    SketchMenuLayerSelector,
    SketchMenuCompositionControls,
    SketchLayerCategoryDropdowns,
    LayerControlDashboard,
    AudioPlayer,
  },
  data: () => ({
    menuOpen: false,
    audioPlayerOpen: false,
    RegisteredSketches,
    sketchIndexSelected: null,
    auxInputVisibible: false,
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

    toggleAuxInputFields() {
      this.auxInputVisibible = !this.auxInputVisibible;
    },
  },
};
</script>

<style lang="scss" scoped>

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

.layer-control-title {
  height: 49px;
  border-bottom: 1px solid $color-std-grey;
}
.layer-control-header {
  position: relative;

  .close {
    position: absolute;
    top: 0;
    left: 0;
  }
}

#audio-player-toggle-wrapper {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
}
</style>
