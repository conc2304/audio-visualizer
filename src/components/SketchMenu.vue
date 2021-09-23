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

        #audio-player-toggle-wrapper
          v-divider
          v-list( dense nav)
            v-list-item(
              :class="{ 'active': audioPlayerOpen }"
              @click="updateAudioPlayerOpen(!audioPlayerOpen)"
            )
              v-icon.menu-icon music_note

        v-divider

        MenuLayerSelector(
          :RegisteredSketches="RegisteredSketches"
          :layerMenuOpen="layerMenuOpen"
        )

        v-divider

        MenuCompositionControls(
          @toggle_aux_input="toggleAuxInputFields"
          @update_help_modal="updateHelpModal"
          @update_snackbar="updateSnackbarStatus"
        )

        v-divider

        MenuPresetLauncher(
          v-if="!presetSlotsDisabled"
          @update_preset_selected="updatePresetSelected"
          :presetSlots="presetSlots"
          :presetSelectedIndex="presetSelectedIndex"
        )


      LayerControlPanel(
        v-show="layerMenuOpen"
        @layer_menu_toggle="layerMenuToggleEvent"
      )


    AudioPlayer(
      v-show="audioPlayerOpen"
      @close_audio_player="audioPlayerOpen = false"
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

import {
  UPDATE_SKETCH_INDEX_SELECTED,
  UPDATE_LAYER_MENU_OPEN,
  UPDATE_AUDIO_PLAYER_OPEN,
  UPDATE_CATALOGUE_OPEN,
  UPDATE_AUX_INPUT_VISIBLE,
} from '../store/mutationTypes';

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
    sketchIndexSelected: null,
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

  computed: {
    RegisteredSketches() {
      return this.$store.state.RegisteredSketches;
    },

    presetSlotsDisabled() {
      return this.$store.state.presetSlotsDisabled;
    },

    auxInputVisible() {
      return this.$store.state.auxInputVisible;
    },

    layerMenuOpen() {
      return this.$store.state.layerMenuOpen;
    },

    catalogueOpen() {
      return this.$store.state.catalogueOpen;
    },

    audioPlayerOpen() {
      return this.$store.state.audioPlayerOpen;
    },
  },

  methods: {
    updateMasterMenu() {
      this.$store.commit(UPDATE_LAYER_MENU_OPEN, false);
    },

    layerMenuToggleEvent(status) {
      this.$store.commit(UPDATE_LAYER_MENU_OPEN, status);
      if (status === true) {
        this.$store.commit(UPDATE_CATALOGUE_OPEN, false);
        this.$store.commit(UPDATE_AUDIO_PLAYER_OPEN, false);
      }
    },

    updateAudioPlayerOpen(status) {
      this.$store.commit(UPDATE_AUDIO_PLAYER_OPEN, status);
      if (status === true) {
        this.$store.commit(UPDATE_CATALOGUE_OPEN, false);
        this.$store.commit(UPDATE_LAYER_MENU_OPEN, false);
        this.$store.commit(UPDATE_SKETCH_INDEX_SELECTED, -1);
      }
    },

    toggleAuxInputFields() {
      this.$store.commit(UPDATE_AUX_INPUT_VISIBLE, !this.auxInputVisible);
    },

    setCatalogueStatus(status) {
      this.catalogueOpen = status;
      if (this.catalogueOpen === true) {
        this.$store.commit(UPDATE_LAYER_MENU_OPEN, false);
        this.$store.commit(UPDATE_AUDIO_PLAYER_OPEN, status);
        return;
      }
      if (this.catalogueOpen === false && this.sketchIndexSelected !== null) {
        this.$store.commit(UPDATE_LAYER_MENU_OPEN, true);
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

// #audio-player-toggle-wrapper {
//   position: absolute;
//   bottom: 10px;
//   left: 0;
//   right: 0;
// }
</style>

<style lang="scss">
i,
.v-icon {
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
      40% 0%,
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
  color: $color-inactive-red-hover;
}
</style>
