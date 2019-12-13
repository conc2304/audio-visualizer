<template lang="pug">
  v-dialog(
    v-model="modalOpen"
    @input="$emit('input')"
    max-width="500"
    scrollable
    dark
  )
    v-card.help-box
      v-card-title(class="headline text-center font-weight-bold") How to VYZBY
      v-divider

      v-card-text.dialog-content( class="thin-custom-scrollbar")
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
</template>

<script>
export default {
  data: () => ({
    modalOpen: false,
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
      this.$emit('update_help_modal', newVal);
    },
  },
};
</script>

<style lang="scss" scoped>
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
