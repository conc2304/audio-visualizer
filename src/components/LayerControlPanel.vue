<template lang="pug">
  #layer-controls-container( v-show="menuOpen")
    .layer-control-header
      .layer-control-title
        h3.center Layer {{ sketchIndexSelected + 1 }} Controls
        h5.center {{ sketchName }}
        v-list-item.close( @click="closeMenu")
          v-icon close

      LayerDashboard

    .layer-control-contents
      LayerCategoriesExpansionList
</template>

<script>
import LayerDashboard from '@/components/LayerDashboard.vue';
import LayerCategoriesExpansionList from '@/components/LayerCategoriesExpansionList.vue';
import { UPDATE_SKETCH_INDEX_SELECTED } from '../store/mutationTypes';

export default {
  data: () => ({
    menuOpen: false,
  }),

  components: {
    LayerDashboard,
    LayerCategoriesExpansionList,
  },

  props: {},

  methods: {
    closeMenu() {
      this.menuOpen = false;
      this.$store.commit(UPDATE_SKETCH_INDEX_SELECTED, null);
      this.$emit('layer_menu_toggle', false);
    },
  },

  updated() {
    console.log(0, 'UPDATED', 'Layer Control Panel');
  },

  computed: {
    sketchIndexSelected() {
      return this.$store.state.sketchIndexSelected;
    },

    sketchInView() {
      return this.$store.state.sketchInView;
    },

    sketchName() {
      return this.sketchInView?.catalogueInfo?.title ?? '';
    },
  },
};
</script>

<style lang="scss" scoped>
#layer-controls-container {
  display: inline-block;
  vertical-align: top;
}

#layer-controls-container {
  width: $secondary-menu-width;

  .center {
    text-align: center;
  }
  h3 {
    margin-top: 10px;
  }
  h5 {
    font-family: Roboto;
  }
}

#layer-control-menu {
  background-color: #000000bd;
  overflow-y: scroll;
  border-right: 1px solid $subtle-border;
}

.layer-control-header {
  position: relative;
  height: 97px;
  border-bottom: 1px solid $color-std-grey;

  .close {
    position: absolute;
    top: 0;
    right: 0;
  }
}

#toggle-layer-controls-container {
  position: absolute;
  top: 0;
  left: 60px;
  background-color: $color-std-grey;
  border-left: 1px solid $subtle-border;
  border-radius: 0 10px 10px 0;

  i {
    color: $color-off-white;
  }
}
</style>
