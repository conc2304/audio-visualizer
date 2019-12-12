<template lang="pug">
  #settings-menubar

    v-card#control-panel(
      dark
      v-cloak
    )

      #master-controls-container
        v-list-item( to="/")
          v-icon home

        v-divider
        MenuLayerSelector(
          :RegisteredSketches="RegisteredSketches"
          :menuOpen="menuOpen"
          :sketchIndexSelected="sketchIndexSelected"
          @layer_selected="updatesketchIndexSelected"
          @catalogue_open="setCatalogueStatus"
        )
        v-divider
        MenuCompositionControls(
          @toggle_aux_input="toggleAuxInputFields"
          @open_help_modal="openHelpModal"
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

      LayerControlPanel(
        v-show="menuOpen"
        @menu_closed_event="closeMenu"
        :sketchIndexSelected="sketchIndexSelected"
        :RegisteredSketches="RegisteredSketches"
        :auxInputVisibible="auxInputVisibible"
      )


    AudioPlayer(
      v-show="audioPlayerOpen"
    )

    CatalogueList#sketch-catalogue(
      v-show="catalogueOpen"
      @catalogue_open="setCatalogueStatus"
    )


    v-dialog(
      v-model="helpModal"
      max-width="500"
      max-height="500"
      scrollable
      dark
    )
      v-card
        v-card-title( class="headline") So ummm... how?

        v-card-text All of these knobs and buttons can be a bit overwhelming, let's break it down.
        v-card-text Ways to interact:
        v-card-text
          .help-item(
            v-for="(interaction, i) in help.interactions"
          )
            p.item-title {{ interaction.input }}
            p.item-subtitle {{ interaction.how }}




</template>

<script>
import MenuLayerSelector from '@/components/MenuLayerSelector.vue';
import MenuCompositionControls from '@/components/MenuCompositionControls.vue';
import LayerControlPanel from '@/components/LayerControlPanel.vue';
import AudioPlayer from '@/components/AudioPlayer.vue';
import CatalogueList from '@/components/CatalogueList.vue';
import HelpDialog from '@/components/HelpDialog.vue';

import RegisteredSketches from '@/js/services/SketchRegistration';

export default {
  components: {
    MenuLayerSelector,
    MenuCompositionControls,
    LayerControlPanel,
    AudioPlayer,
    CatalogueList,
    HelpDialog,
  },

  data: () => ({
    menuOpen: false,
    audioPlayerOpen: false,
    RegisteredSketches,
    sketchIndexSelected: null,
    auxInputVisibible: false,
    catalogueOpen: false,
    helpModal: true,
    help: {
      interactions: [
        {
          input: 'Parameter Sliders',
          how:
            'These have 3 slide-handles that control: Minimum, Current, and Max.  The Minimum and Maximum control the range within which the slider can change via audio input and/or randomizing parameters.',
        },
        {
          input: 'Parameter Radio Buttons',
          how: 'These let you switch between different layer modes.',
        },
        {
          input: 'test',
          how: 'These let you switch between different layer modes.',
        },
      ],
    },
  }),

  methods: {
    updatesketchIndexSelected(sketchIndexSelected) {
      this.menuOpen = true;
      this.sketchIndexSelected = sketchIndexSelected;
    },

    closeMenu() {
      this.sketchIndexSelected = null;
      this.menuOpen = false;
    },

    toggleAuxInputFields() {
      this.auxInputVisibible = !this.auxInputVisibible;
    },

    openHelpModal() {
      this.helpModal = true;
    },

    setCatalogueStatus(status) {
      this.catalogueOpen = status;
      if (this.catalogueOpen === true) {
        this.menuOpen = false;
        this.audioPlayerOpen = false;
        return;
      }
      if (this.catalogueOpen === false && this.sketchIndexSelected !== null) {
        this.menuOpen = true;
      }
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

#sketch-catalogue {
  background: $color-transparent-black;
  padding: 20px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 60px;
  z-index: 10;
  margin: 0 auto;
  overflow: auto;
  border: 1px solid $subtle-border;
}
</style>
