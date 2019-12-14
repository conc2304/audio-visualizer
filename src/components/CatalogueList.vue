<template lang="pug">
  v-card#sketch-catalogue-list(
    max-width="500"
    class="mx-auto"
    dark
  )
    v-container.catalogu-header
      v-row.catalogue-header
        h2 Sketch Catalogue
        v-spacer
        v-btn(
          @click="closeCatalogue"
          text fab small
          right
        )
          v-icon close
      .temp( v-if="false")
        v-row( class="flex-center")
          v-col( cols="8" sm="8")
            v-text-field(
              v-model="search"
              autocomplete="off"
              clearable
              clear-icon="close"
              :append-icon="'search'"
              placeholder="Search ..."
              hint="Search for sketches by title, creator, or by tags"
              outlined
              dense dark
            )

      .temp( v-if="true")
        v-row.search-wrapper
          v-col( class="d-flex" cols="12" sm="6")
            v-text-field(
              v-model="search"
              autocomplete="off"
              clearable
              clear-icon="close"
              :append-icon="'search'"
              placeholder="Search ..."
              hint="Search for sketches by title, creator, or by tags"
              outlined
              dense dark
            )
          v-col( class="d-flex" cols="12" sm="6")
            v-select(
              :items="sortByItems"
              :append-icon="'expand_more'"
              clearable
              clear-icon="close"
              label="Sort By..."
              outlined
              dense dark
            )

    v-divider

    v-container.catalogue-content( class="custom-thin-scrollbar")
      v-row( dense light)
        v-col( cols="12")
          v-card(
            color="#385F73"
            dark
          )
            v-card-title.headline Tons of processing sketches to choose from!
            v-card-subtitle Choose sketches from your favorite categories and made by your favorite creators!

        v-col(
          v-for="(sketch, i) in filteredSketchCatalogue"
          :key="`sketch-${i}`"
          cols="12"
        )
          CatalogueItemCard(
            v-if="sketch.catalogueInfo"
            :catalogueItem="sketch.catalogueInfo"
            :search="search"
        )
</template>

<script>
import CatalogueItemCard from '@/components/CatalogueItemCard.vue';
import SketchCatalogue from '@/js/services/SketchCatalogue';

export default {
  data: () => ({
    SketchCatalogue,
    search: '',
    sortByItems: ['Creator', 'Title'],
  }),

  components: {
    CatalogueItemCard,
  },

  methods: {
    closeCatalogue() {
      this.$emit('catalogue_open', false);
    },
  },

  computed: {
    filteredSketchCatalogue() {
      if (this.search === null || !this.search) {
        return this.SketchCatalogue;
      }

      const search = this.search.toLowerCase();

      return this.SketchCatalogue.filter(sketch => {
        const filterables = ['creator', 'title', 'description'];
        let match = false;
        for (let filterName of filterables) {
          if (sketch.catalogueInfo[filterName].toLowerCase().includes(search)) {
            return true;
          }
        }

        if (sketch.catalogueInfo.tags) {
          for (let tag of sketch.catalogueInfo.tags) {
            if (tag.toLowerCase().includes(search)) {
              return true;
            }
          }
        }

        return false;
      });
    },
  },

  mounted() {},
};
</script>

<style lang="scss" scoped>
#sketch-catalogue-list {
  overflow-y: scroll;
}
.flex-center {
  justify-content: center;
}
.catalogue-content {
  width: 100%;
  height: 100vh;
  padding-bottom: 350px;
  overflow-y: scroll;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  background-color: $color-transparent-black;

  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    background-color: $color-transparent-black;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: $color-transparent-black;
    background-image: -webkit-gradient(
      linear,
      40% 0%,
      75% 84%,
      from($color-transparent-black),
      to(#0c6b98),
      color-stop(0.9, #0e83cd)
    );
  }
}
</style>
