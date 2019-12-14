<template lang="pug">
  v-card(
    dark
  )
    .card-wrapper( class="d-flex flex-no-wrap justify-space-between")
      .card-inner-wrapper
        v-card-title(
          class="headline"
        ) {{ catalogueItem.title }}
          br

        v-card-subtitle.no-padding
          small.creator by {{ catalogueItem.creator }}
        v-card-subtitle {{ catalogueItem.description }}

        v-chip.tag-chip(
          v-for="(tag, i) in catalogueItem.tags.slice(0, 5)"
          :key="`tag-${i}`"
          outlined
          small
          :color="getTagMatchColor(tag)"
        ) {{ tag }}


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
    search: {
      type: String,
      required: false,
    },
  },

  methods: {
    registerNewSketch(catalogueItem) {
      this.SketchRegistration.push(new catalogueItem.classConstructor(window.innerWidth, window.innerHeight));
    },

    getTagMatchColor(tag) {

      return this.search && tag.toLowerCase() == this.search.toLowerCase() ? 'blue' : 'grey';
    },
  },

  computed: {
    maxLayersReached() {
      return this.SketchRegistration.length > this.maxLayers
    }
  },

  mounted() {
  },
};
</script>

<style lang="scss" scoped>
.creator {
  padding-left: 1rem;
  font-style: italic;
}

.tag-chip {
  margin: 0 0 0.5rem 0.5rem;
}
</style>
