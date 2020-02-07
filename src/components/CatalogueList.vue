<template lang="pug">
  #sketch-catalogue-panel
    v-card#sketch-catalogue-list(
      max-width="500"
      class="mx-auto"
    )

      v-container.catalogue-header
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
                :prepend-icon="'search'"
                placeholder="Search ..."
                hint="Search for sketches by title, creator, or by tags"
                outlined
                dense
              )

        .temp( v-if="true")
          v-row.search-wrapper
            v-col( class="d-flex" cols="12" sm="6")
              v-text-field(
                v-model="search"
                autocomplete="off"
                clearable
                clear-icon="close"
                :prepend-icon="'search'"
                placeholder="Search ..."
                hint="Search for sketches by title, creator, or by tags"
                outlined
                dense
              )
            v-col( class="d-flex" cols="12" sm="6")
              v-select(
                v-model="sortBy"
                :items="sortByFields"
                :append-icon="'expand_more'"
                clearable
                clear-icon="close"
                label="Sort By..."
                @change="triggerSort()"
                outlined
                dense
              )

      v-divider

      v-container.catalogue-content( class="custom-thin-scrollbar")
        v-row( dense light)
          v-col( cols="12")
            v-card(
              color="#385F73"

            )
              v-card-title.headline Tons of processing sketches to choose from!
              v-card-subtitle Choose sketches from your favorite categories and made by your favorite creators!
              v-card-subtitle
                small Got a sketch idea you want to see here? Well now is your chance to contribute!
                br
                small Head over to <a href="https://github.com/conc2304/audio-visualizer/" target="_blank"> Github </a> and become a creator!

          v-col(
            v-for="(sketch, index) in filteredSketchCatalogue"
            :key="`sketch-${index}`"
            cols="12"
          )
            CatalogueItemCard(
              v-if="sketch.catalogueInfo"
              :catalogueItem="sketch.catalogueInfo"
              :search="search"
              :catalogueIndex="index"
          )
</template>

<script>
import CatalogueItemCard from '@/components/CatalogueItemCard.vue';
import SketchCatalogue from '@/js/services/SketchCatalogue';

export default {
  data: () => ({
    SketchCatalogue,
    search: '',
    sortByFields: [
      { text: 'Creator', value: 'creator' },
      { text: 'Title', value: 'title' },
      { text: 'Popularity', value: 'popularity' },
      { text: 'Complexity', value: 'complexity' },
    ],
    sortBy: '',
    reverseSort: false,
  }),

  components: {
    CatalogueItemCard,
  },

  methods: {
    closeCatalogue() {
      this.$store.commit('updateCatalogueOpen', false);
    },

    compare(a, b) {
      let sortBy = this.sortBy.toLowerCase();
      a = a.catalogueInfo[sortBy];
      b = b.catalogueInfo[sortBy];

      if (a < b) return 1;
      if (b < a) return -1;

      return 0;
    },

    triggerSort() {
      this.getFilterList();
    },

    getSortedList(list) {
      return list.sort(this.compare);
    },

    getFilterList() {
      const search = this.search ? this.search.toLowerCase() : '';
      return this.SketchCatalogue.filter(sketch => {
        const filterables = ['creator', 'title', 'description'];

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

  computed: {
    filteredSketchCatalogue() {
      let filteredList = this.SketchCatalogue;
      if (this.search) {
        filteredList = this.getFilterList();
      }

      if (this.sortBy) {
        filteredList = this.getSortedList(filteredList);
      }

      return filteredList;
    },
  },

  mounted() {},
};
</script>

<style lang="scss" scoped>
#sketch-catalogue-panel {
  background: $color-transparent-black;
  padding: 20px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: $master-menu-width;
  z-index: 10;
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid $subtle-border;
}

#sketch-catalogue-list {
  background-color: $color-transparent-black;
}

.flex-center {
  justify-content: center;
}
.catalogue-content {
  width: 100%;
  height: 100vh;
  padding-bottom: 250px;
  padding-right: 1.5rem;
  overflow-y: scroll;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  background-color: $color-transparent-black;

  a {
    color: #fff;

    &:active,
    &:visited,
    &:focus {
      color: #fff;
    }
  }

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
      to($color-secondary-blue),
      color-stop(0.9, $color-primary-blue)
    );
  }
}
</style>
