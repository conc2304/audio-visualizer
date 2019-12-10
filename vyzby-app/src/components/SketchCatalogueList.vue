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
          v-for="(sketch, i) in SketchCatalogue"
          :key="`sketch-${i}`"
          cols="12"
        )
          v-card(
            dark
          )
            .card-wrapper( class="d-flex flex-no-wrap justify-space-between")
              .card-inner-wrapper
                v-card-title(
                  class="headline"
                ) {{ sketch.title }}
                  small.creator by {{ sketch.creator }}

                v-card-subtitle() {{ sketch.description }}

                v-chip.category-chip(
                  v-for="(category, i) in sketch.filterCategories"
                  :key="`category-${i}`"
                  outlined
                  small
                  :color="getCategoryMatchColor(category)"
                ) {{ category }}

                v-card-actions
                  v-btn(
                    @click="registerNewSketch(sketch.constructorName)"
                    fab
                    small
                  )
                    v-icon(
                      @click="registerSketch(i)"
                    ) add

              v-avatar(
                class="ma-3"
                size="150"
                tile
              )
                v-img( :src="sketch.gifURI" alt='test')
</template>

<script>
import SketchCatalogue from '@/js/services/SketchCatalogue';
import SketchRegistration from '@/js/services/SketchRegistration';

export default {
  data: () => ({
    SketchCatalogue,
    filter: 'WEBGL',
  }),

  methods: {
    registerSketch() {
      console.log(this.SketchCatalogue);
    },

    getCategoryMatchColor(category) {
      return category.toLowerCase() == this.filter.toLowerCase() ? 'blue' : 'grey';
    },

    closeCatalogue() {
      this.$emit('catalogue_open', false);
      console.log('status');
    },
  },

  mounted() {
    console.log(this.SketchCatalogue);
  },
};
</script>

<style lang="scss" scoped>
#sketch-catalogue-list {
  background-color: red;
}

.creator {
  padding-left: 10px;
  font-style: italic;
}

.category-chip {
  margin-left: 1rem;
}
</style>
