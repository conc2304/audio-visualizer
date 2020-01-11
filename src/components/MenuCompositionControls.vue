<template lang="pug">
  #composition-controls
    .menu-dash-group
      v-tooltip( right)
        template( v-slot:activator= "{ on }")
          v-list-item.no-padding(
            @click="globalDashVisible = !globalDashVisible"
          )
            p(
              v-on="on"
            ) Global
        span {{ globalDashVisible ? 'Hide' : 'Show' }} Global Controls
      .global-dash-buttons(
        v-show="globalDashVisible"
      )
        v-list( dense nav)
          v-list-item(
            v-for="menuItemData in masterMenuItems"
            :key="menuItemData.title"
            :class="{ 'inactive': !auxInputVisible && menuItemData.id === 'toggle-input-assigner' }"
            @click="clickHandler(menuItemData.action)"
          )
            IconWithTooltip(
              :menuItemData='menuItemData'
            )
</template>

<script>
import IconWithTooltip from '@/components/IconWithTooltip.vue';
import BulkUpdateService from '@/js/services/BulkUpdaterService';
import RegisteredSketches from '@/js/services/SketchRegistration';

export default {
  components: {
    IconWithTooltip,
  },

  data: () => ({
    globalDashVisible: true,
    auxInputVisible: false,
    masterMenuItems: [
      {
        mdIconText: 'help',
        id: 'toggle-help',
        title: 'Show Help Box',
        action: 'openHelpModal',
      },
      {
        mdIconText: 'shuffle',
        id: 'randomize-settings',
        title: 'Randomize Everything',
        action: 'randomizeComposition',
      },

      {
        mdIconText: 'restore',
        id: 'reset-settings',
        title: 'Reset Everything',
        action: 'resetComposition',
      },
      {
        mdIconText: 'input',
        id: 'toggle-input-assigner',
        title: 'Toggle layers\' auxiliary input settings (set keyboard inputs, audio inputs ...)',
        action: 'toggleAuxInputFields',
      },
      // {
      //   mdIconText: 'save_alt',
      //   id: 'save-settings',
      //   title: 'Save composition state to Preset Slot',
      //   action: 'openPresetAssigner',
      // },
    ],
  }),

  methods: {
    clickHandler(functionName) {
      this[functionName]();
    },

    randomizeComposition() {
      const indices = Object.keys(RegisteredSketches);
      BulkUpdateService.changeParameterValues(indices, 'randomize');
    },

    openHelpModal() {
      this.$emit('update_help_modal', true);
    },

    resetComposition() {
      const indices = Object.keys(RegisteredSketches);
      BulkUpdateService.changeParameterValues(indices, 'reset');
    },

    toggleAuxInputFields() {
      this.auxInputVisible = !this.auxInputVisible;
      this.$emit('toggle_aux_input', true);
    },

    openPresetAssigner() {
      this.$emit('update_snackbar', true);
    },
  },
};
</script>

<style lang="scss"></style>
