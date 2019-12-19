<template lang="pug">
  #settings-menubar
    v-card#control-panel(
      v-cloak
    )

      #master-controls-container(
        class="custom-thin-scrollbar"
      )
        v-list-item( @click="updateMasterMenu")
          v-icon close

        v-divider

        MenuLayerSelector(
          :RegisteredSketches="RegisteredSketches"
          :layerMenuOpen="layerMenuOpen"
          @open_layer_menu="layerMenuToggleEvent"
          @catalogue_open="setCatalogueStatus"
        )

        v-divider

        MenuCompositionControls(
          @toggle_aux_input="toggleAuxInputFields"
          @update_help_modal="updateHelpModal"
          @update_snackbar="updateSnackbarStatus"
        )

        v-divider

        MenuPresetLauncher(
          @update_preset_selected="updatePresetSelected"
          :presetSlots="presetSlots"
          :presetSelectedIndex="presetSelectedIndex"
        )

        #audio-player-toggle-wrapper
          v-divider
          v-list( dense nav)
            v-list-item(
              :class="{ 'active': audioPlayerOpen }"
              @click="audioPlayerOpen = !audioPlayerOpen"
            )
              v-icon.menu-icon music_note

      LayerControlPanel(
        v-show="layerMenuOpen"
        @layer_menu_toggle="layerMenuToggleEvent"
        :RegisteredSketches="RegisteredSketches"
        :auxInputVisibible="auxInputVisibible"
      )


    AudioPlayer(
      v-show="audioPlayerOpen"
    )

    CatalogueList(
      v-show="catalogueOpen"
      @catalogue_open="setCatalogueStatus"
    )

    HelpDialog(
      :helpModalOpen="helpModalOpen"
      @update_help_modal="updateHelpModal"
    )

    PresetAssignSnackbar(
      :snackbarOpen="snackbarOpen"
      :presetSlots="presetSlots"
      @update_snackbar="updateSnackbarStatus"
      @update_preset_selected="updatePresetSelected"
    )

</template>

<script>
import MenuLayerSelector from '@/components/MenuLayerSelector.vue';
import MenuCompositionControls from '@/components/MenuCompositionControls.vue';
import MenuPresetLauncher from '@/components/MenuPresetLauncher.vue';
import LayerControlPanel from '@/components/LayerControlPanel.vue';
import AudioPlayer from '@/components/AudioPlayer.vue';
import CatalogueList from '@/components/CatalogueList.vue';
import HelpDialog from '@/components/HelpDialog.vue';
import PresetAssignSnackbar from '@/components/PresetAssignSnackbar.vue';

import RegisteredSketches from '@/js/services/SketchRegistration';

export default {
  components: {
    MenuLayerSelector,
    MenuCompositionControls,
    MenuPresetLauncher,
    LayerControlPanel,
    AudioPlayer,
    CatalogueList,
    HelpDialog,
    PresetAssignSnackbar,
  },

  data: () => ({
    layerMenuOpen: false,
    audioPlayerOpen: false,
    RegisteredSketches,
    sketchIndexSelected: null,
    auxInputVisibible: false,
    catalogueOpen: false,
    helpModalOpen: false,
    snackbarOpen: false,
    presetSelectedIndex: -1,

    presetSlots: [
      {
        iconText: 'looks_one',
        empty: true,
      },
      {
        iconText: 'looks_two',
        empty: true,
      },
      {
        iconText: 'looks_3',
        empty: true,
      },
      {
        iconText: 'looks_4',
        empty: true,
      },
    ],
  }),

  methods: {
    updateMasterMenu() {
      this.$emit('master_menu_update', false);
    },
    updatesketchIndexSelected(sketchIndexSelected) {
      this.layerMenuOpen = true;
    },

    layerMenuToggleEvent(event) {
      this.layerMenuOpen = event;
    },

    toggleAuxInputFields() {
      this.auxInputVisibible = !this.auxInputVisibible;
    },

    setCatalogueStatus(status) {
      this.catalogueOpen = status;
      if (this.catalogueOpen === true) {
        this.layerMenuOpen = false;
        this.audioPlayerOpen = false;
        return;
      }
      if (this.catalogueOpen === false && this.sketchIndexSelected !== null) {
        this.layerMenuOpen = true;
      }
    },

    updateSnackbarStatus(isOpen) {
      this.snackbarOpen = isOpen;
    },

    updateHelpModal(isOpen) {
      this.helpModalOpen = isOpen;
    },

    saveToPreset(index) {
      this.presetSlots[index].empty = false;
    },

    updatePresetSelected(index) {
      this.presetSelectedIndex = index;
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
  width: $master-menu-width;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

i.off-white {
  color: $color-off-white;
}

#master-controls-container {
  display: inline-block;
  vertical-align: top;
}

#audio-player-toggle-wrapper {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
}

</style>

<style lang="scss">
i {
  margin: 0 auto;
  text-align: center;
}
.custom-thin-scrollbar {
  $color-bkgd: $color-std-grey;

  &::-webkit-scrollbar {
    width: 5px;
    background-color: $color-bkgd;
  }

  &.scrollbar__thick::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: $color-bkgd;
    background-image: -webkit-gradient(
      linear,
      0% 20%,
      50% 80%,
      from($color-bkgd),
      to($color-secondary-blue),
      color-stop(0.9, $color-primary-blue)
    );
  }

  &::-webkit-scrollbar-track {
    background-color: $color-bkgd;
  }

  &::-webkit-scrollbar-corner {
    background-color: $color-bkgd;
  }
}
.preset-selector-wrapper {
  display: flex;
  justify-content: center;
  .v-list-item {
    width: 60px;
  }
}

.preset-full {
  color: $color-primary-blue;
}

.preset-empty {
  color: $color-off-white;
}

#control-panel {
  .menu-dash-group {
    margin: 15px auto;

    p {
      width: auto;
      margin: 0 auto;
      text-align: center;
    }
  }
}

.no-padding {
  padding: 0;
}

#composition-controls .inactive .v-icon.menu-icon {
  color: $color-inactive-red;
}
</style>
