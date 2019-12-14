<template lang="pug">
  v-card#sketch-catalogue-list(
    max-width="500"
    class="mx-auto"
  )

    v-app-bar(
      dark
      color="#424242"
    )
      v-toolbar-title Sketch Catalogue
      v-spacer
      v-btn(
        @click="closeCatalogue"
        text
        fab
        small
      )
        v-icon close

    v-container
      v-row( dense light)
        v-col( cols="12")
          v-card(
            color="#385F73"
            dark
          )
            v-card-title.headline Tons of processing sketches to choose from!
            v-card-subtitle Choose sketches from your favorite categories and made by your favorite creators!

        v-col(
          v-for="(catalogueItem, i) in SketchCatalogue"
          :key="`sketch-${i}`"
          cols="12"
        )
          CatalogueItemCard(
            :catalogueItem="catalogueItem"
            :filter="filter"
          )
</template>

<script>
import CatalogueItemCard from '@/components/CatalogueItemCard.vue';
import SketchCatalogue from '@/js/services/SketchCatalogue';

export default {
  data: () => ({
    SketchCatalogue,
    filter: '',
  }),

  components: {
    CatalogueItemCard,
  },

  methods: {

    closeCatalogue() {
      this.$emit('catalogue_open', false);
    },
  },

};
</script>

<style lang="scss" scoped>
</style>
