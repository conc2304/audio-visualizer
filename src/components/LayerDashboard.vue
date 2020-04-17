<template lang="pug">
  .layer-dashboard

    v-list( dense nav)
      v-list-item(
        v-for="menuItemData in layerDashboardActions"
        :key="menuItemData.title"
        @click="layerClickHandler(menuItemData.action)"
      )
        v-tooltip(
          bottom
        )
          template( v-slot:activator= "{ on }")
            v-icon.menu-icon(
              :id='menuItemData.id'
              v-on="on"
              class="global-control helper"
            ) {{ menuItemData.mdIconText }}
          span.test  {{ menuItemData.title }}
      </template>

<script>
import IconWithTooltip from '@/components/IconWithTooltip.vue';
import BulkUpdateService from '@/js/services/BulkUpdaterService';

export default {
  components: {
    IconWithTooltip,
  },

  props: {
    // sketchIndexSelected: {
    //   type: Number,
    // },
    RegisteredSketches: {
      type: Array,
    },
  },

  data: () => ({
    layerDashboardActions: [
      {
        mdIconText: 'visibility',
        tooltipText: 'Toggle Layer Visibility',
        title: 'Visibility',
        action: 'toggleLayerVisibility',
        bypass: false,
      },
      // {
      //   mdIconText: 'waves',
      //   tooltipText: 'Randomize Audio Responsiveness',
      //   title: 'Randomize Audio Responsiveness',
      //   action: 'randomizeAudioResponse',
      // },
      {
        mdIconText: 'shuffle',
        tooltipText: 'Randomizes all values this layer. Excludes audio reactive control',
        title: 'Randomize Everything',
        action: 'randomizeLayerParameters',
      },

      {
        mdIconText: 'restore',
        id: 'reset-settings',
        tooltipText: 'Reset Layer. Excludes audio reactive control',
        title: 'Layer Reset',
        action: 'resetLayer',
      },
    ],
  }),

  methods: {
    layerClickHandler(functionName) {
      this[functionName]();
    },

    logSketchItem() {},

    resetLayer() {
      const iString = this.sketchIndexSelected.toString();
      const indices = [iString];
      BulkUpdateService.changeParameterValues(indices, 'reset');
    },

    randomizeAudioResponse() {},

    randomizeLayerParameters() {
      const iString = this.sketchIndexSelected.toString();
      const indices = [iString];

      BulkUpdateService.changeParameterValues(indices, 'randomize');
    },

    toggleLayerVisibility() {
      const index = this.sketchIndexSelected;
      const bypassStatus = !this.RegisteredSketches[index].bypass;
      this.RegisteredSketches[index].bypass = bypassStatus;
      this.layerDashboardActions[0].mdIconText = bypassStatus ? 'visibility_off' : 'visibility';
    },
  },

  computed: {
    sketchIndexSelected() {
      return this.$store.state.sketchIndexSelected;
    },
  },
};
</script>

<style lang="scss" scoped>
.layer-dashboard {
  .v-list {
    background: transparent;
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: space-evenly;
  }
  .v-list-item {
    flex: none;
  }

  .v-tooltip__content {
    background-color: #000;
    border: 1px solid #555555;
  }
}
</style>
