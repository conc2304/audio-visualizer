<template lang="pug">
  v-dialog(
    v-model="modalOpen"
    @input="$emit('input')"
    max-width="500"
    scrollable
  )
    v-card.help-box
      v-card-title(class="headline text-center font-weight-bold") How to VYZBY
      v-divider

      v-card-text.dialog-content( class="custom-thin-scrollbar")
        h3( class="headline text-center font-weight-bold") Ways to interact:
        .help-item(
          v-for="(interaction, i) in help.interactions"
          :key="`interaction-${i}`"
        )
          h4.item-title( class="font-weight-bold") {{ interaction.input }}
          p.item-subtitle {{ interaction.how }}

        br
        h3( class="headline text-center font-weight-bold") Using Auxiliary Inputs:

        p You can show/hide the aux input fields for all of the parameters by pressing the
          v-icon.example-icon input
          span button in the Global menu.  These fields will appear under each layer's parameter.
        .help-item(
          v-for="(auxInput, i) in help.auxInputs"
          :key="`auxInputs-${i}`"
        )
          h4.item-title {{ auxInput.method }}
          p.item-subtitle {{ auxInput.how }}

        .preset-slot-wrapper( v-if="!presetSlotsDisabled")
          h3( class="headline text-center font-weight-bold") Preset Slots (in development)
          h5( class="text-center font-weight-bold") Save the state of a composition to trigger later!

          .help-item
            h4.item-title Saving
            p.item-subtitle Press the
              v-icon.example-icon save_alt
              span button in the Global menu.  Then select a slot to save it to.  If a slot is blue, it means its full.  Selecting it will override the current preset in that slot.

          .help-item
            h4.item-title Triggering
            p.item-subtitle Open the Preset Slots in the menu and select a previously saved slot.  This will cause all of the current layer settings to change to your preset.

          .help-item
            h4.item-title Deleting
            p.item-subtitle You can clear out all of your presets from the presets pop up. Or you can clear out individual slots by selecting a full slot from the presets menu. Then press the
              v-icon.example-icon delete
              span button from the Preset Slots menu to clear it out.

          .preset-example-container
            .slot-example
              v-icon.example-icon(
                color="color_primary_blue"
              ) looks_one
              span Saved/Full Slots
            .slot-example
              v-icon.example-icon(
                color="color_off_white"
              ) looks_one
              span Empty Slots

        small NOTE : Currently MIDI interfaces are still in development
</template>

<script>
export default {
  data: () => ({
    modalOpen: false,
    help: {
      interactions: [
        {
          input: "Parameter Sliders",
          how:
            "These have 3 slide-handles that control: Minimum, Current, and Max.  The Minimum and Maximum control the range within which the slider can change via audio input and/or randomizing parameters.",
        },
        {
          input: "Parameter Radio Buttons",
          how: "These let you switch between different layer modes.",
        },
        {
          input: "Auxiliary Inputs",
          how:
            "Vyzby allows you to control and animate your composition with a variety of auxiliary inputs including your Computer Keyboard, Audio, and MIDI. And more to come!",
        },
      ],

      auxInputs: [
        {
          method: "Audio Control",
          how:
            "Each of the parameters with a slider have the ability to animate based on the audio playing within VYZBY.  The Gain knob control the 'loudness' of the animation.  Turning the gain down make the parameter animate less to the audio, and vice versa.  The dropdown next to the Gain knob allows you to select a frequency range of the audio that the parameter will animate.  Select 'Low' to animate it to the bass of the song!",
        },
        {
          method: "Computer Keyboard",
          how:
            "We have already pre-assigned a bunch of random keys to get you started: A-Z and 0-9.  Pressing any of these keys that has been assigned to a parameter will animate the layer's parameter.  You can reassign the keyboard key and the value that the keystroke animates to.",
        },
        {
          method: "MIDI Controller (in development)",
          how:
            "The same way you can assign a keystoke, you can assign a MIDI button by putting your cursor in the text field and pressing the MIDI key that you want to bind it to.",
        },
      ],
    },
  }),

  props: {
    helpModalOpen: {
      type: Boolean,
      default: true,
    },
  },

  watch: {
    helpModalOpen(newVal, oldVal) {
      this.modalOpen = newVal;
    },

    modalOpen(newVal, oldVal) {
      this.modalOpen = newVal;
      this.$emit("update_help_modal", newVal);
    },
  },

  computed: {
    presetSlotsDisabled() {
      return this.$store.state.presetSlotsDisabled;
    },
  },
};
</script>

<style lang="scss" scoped>
.preset-example-container {
  display: flex;
  justify-content: space-evenly;
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
</style>
