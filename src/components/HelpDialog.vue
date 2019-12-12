<template lang="pug">
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
