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
          @open_preset_snackbar="snackbar = true"
          :presetSlots="presetSlots"
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
      v-card.help-box
        v-card-title(class="headline text-center font-weight-bold") How to VYZBY
        v-divider

        v-card-text.dialog-content
          h3( class="headline text-center font-weight-bold") Ways to interact:
          .help-item(
            v-for="(interaction, i) in help.interactions"
            :key="`interaction${i}`"
          )
            h4.item-title( class="font-weight-bold") {{ interaction.input }}
            p.item-subtitle {{ interaction.how }}

          br
          h3( class="headline text-center font-weight-bold") Using Auxiliary Inputs:

          p You can show/hide the aux input fields for all of the parameters by pressing the
            v-icon.example-icon keyboard
            span icon in the menu.  These fields will appear under each layer's parameter.
          .help-item(
            v-for="(auxInput, j) in help.auxInputs"
            :key="`auxInputs${j}`"
          )
            h4.item-title {{ auxInput.method }}
            p.item-subtitle {{ auxInput.how }}
          small NOTE : Currently the Audio Player and MIDI interfaces are still in development


    v-snackbar(
      v-model="snackbar"
      left
      multi-line
      :timeout=0
      vertical
    )
      p( class="text-center") Select a slot to save the current compoistion settings to a slot
      small( class="text-center") Selecting a full preset slot will override the slot
      br
      .preset-selector-wrapper
        v-list-item(
          @click="saveToPreset(i)"
          v-for="(preset, i) in presetSlots"
          :key="`preset-selector${i}`"
        )
          v-icon(
            :class=" preset.empty ? 'preset-empty' : 'preset-full'"
          ) {{ preset.iconText }}
        v-list-item(
          @click="snackbar=false"
        )
          v-icon() close


</template>

<script>
import MenuLayerSelector from '@/components/MenuLayerSelector.vue';
import MenuCompositionControls from '@/components/MenuCompositionControls.vue';
import LayerControlPanel from '@/components/LayerControlPanel.vue';
import AudioPlayer from '@/components/AudioPlayer.vue';
import CatalogueList from '@/components/CatalogueList.vue';

import RegisteredSketches from '@/js/services/SketchRegistration';

export default {
  components: {
    MenuLayerSelector,
    MenuCompositionControls,
    LayerControlPanel,
    AudioPlayer,
    CatalogueList,
  },

  data: () => ({
    menuOpen: false,
    audioPlayerOpen: false,
    RegisteredSketches,
    sketchIndexSelected: null,
    auxInputVisibible: false,
    catalogueOpen: false,
    helpModal: false,
    snackbar: false,

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
          input: 'Auxiliary Inputs',
          how:
            'Vyzby allows you to control and animate your composition with a variety of auxiliary inputs including your Computer Keyboard, Audio, and MIDI. And more to come!',
        },
      ],
      auxInputs: [
        {
          method: 'Computer Keyboard',
          how:
            "We have already pre-assigned a bunch of random keys to get you started: A-Z and 0-9.  Pressing any of these keys that has been assigned to a parameter will animate the layer's parameter.  You can reassign the keyboard key and the value that the keystroke animates to.",
        },
        {
          method: 'MIDI Controller (in development)',
          how:
            'The same way you can assign a keystoke, you can assign a MIDI button by putting your cursor in the text field and pressing the MIDI key that you want to bind it to.',
        },
        {
          method: 'Audio Control',
          how:
            "Each of the parameters with a slider have the ability to animate based on the audio playing within VYZBY.  The Gain knob control the 'loudness' of the animation.  Turning the gain down make the parameter animate less to the audio, and vice versa.  The dropdown next to the Gain knob allows you to select a frequency range of the audio that the parameter will animate.  Select 'Low' to animate it to the bass of the song!",
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

    saveToPreset(index) {
      this.presetSlots[index].empty = false;
    }
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

.dialog-content {
  height: 400px;

  h3 {
    margin-top: 1.2rem;
  }
}
.example-icon {
  padding: 0 0.5rem;
}

.preset-full {
  color: $color-primary-blue;
}

.preset-empty {
  color: $color-off-white;
}
</style>

<style lang="scss">

.preset-selector-wrapper {
  display: flex;
  justify-content: center;
  .v-list-item {
    width: 60px;
  }
}
</style>
