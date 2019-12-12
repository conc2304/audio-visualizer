<template lang="pug">
  v-dialog(
      v-model="helpModal"
      max-width="500"
      dark
    )
      v-card
        v-card-title( class="headline") So ummm... how?

        v-card-text All of these knobs and buttons can be a bit overwhelming, let's break it down.
        v-card-text Ways to interact:
        v-card-text
          v-list-item(
            v-for="(interaction, i) in help.interactions"
            two-line
          )

            v-list-item-title {{ interaction.input }}
            v-list-item-subtitle {{ interaction.how }}
</template>

<script>
export default {
  data: () => ({
    help: {
      interactions: [
        {
          input: 'Sliders',
          how: 'Each layer has a series of sliders that have 3 slides: Minimum, Current, and Max.  The Minimum and Maximum handles control the range within the slider can move via audio input and randomizing parameters.',
        },
        {
          input: 'Radio Buttons',
          how: 'Each layer has a series of radio buttons that let you switch between different layer modes.',
        },
      ],
    },
  }),

  props: {
    helpModal: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
