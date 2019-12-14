<template lang="pug">
  v-card(
    dark
  )
    .card-wrapper( class="d-flex flex-no-wrap justify-space-between")
      .card-inner-wrapper
        v-card-title(
          class="headline"
        ) {{ catalogueItem.title }}
          small.creator by {{ catalogueItem.creator }}

        v-card-subtitle() {{ catalogueItem.description }}



        v-chip.category-chip(
          v-for="(category, i) in catalogueItem.filterCategories.slice(0, 5)"
          :key="`category-${i}`"
          outlined
          small
          :color="getCategoryMatchColor(category)"
        ) {{ category }}


      v-avatar(
        class="ma-3"
        size="150"
        tile
      )
        v-img( :src="catalogueItem.gifURI" alt='test')

        v-card-actions
          v-btn(
            v-show="!maxLayersReached"
            @click="registerNewSketch(catalogueItem)"
            fab
            small
            color="blue"
          )
            v-icon() add
</template>

<script>
import SketchRegistration from '@/js/services/SketchRegistration';

export default {
  data: () => ({
    maxLayers: 8,
    SketchRegistration,
  }),

  props: {
    catalogueItem: {
      type: Object,
      required: true,
    },
    filter: {
      type: String,
      required: false,
    },
  },

  methods: {
    registerNewSketch(catalogueItem) {
      this.SketchRegistration.push(new catalogueItem.classConstructor(window.innerWidth, window.innerHeight));
    },

    getCategoryMatchColor(category) {
      return category.toLowerCase() == this.filter.toLowerCase() ? 'blue' : 'grey';
    },
  },

  computed: {
    maxLayersReached() {
      return this.SketchRegistration.length > this.maxLayers
    }
  },

  mounted() {
    console.log(this.catalogueItem);
  },
};
</script>

<style lang="scss" scoped>
.creator {
  padding-left: 1rem;
  font-style: italic;
}

.category-chip {
  margin: 0 0 0.5rem 0.5rem;
}
</style>
