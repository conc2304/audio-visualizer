<template lang="pug">
  #composition-controls

    .master-dashboard-group-wrapper
      p Global
      v-list( dense nav)
        v-list-item(
          v-for="menuItemData in masterMenuItems"
          :key="menuItemData.title"
          :class="{ 'inactive': auxInputVisible && menuItemData.id === 'toggle-input-assigner' }"
          @click="clickHandler(menuItemData.action)"
        )
          IconWithTooltip(
            :menuItemData='menuItemData'
          )

    v-divider


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
    auxInputVisible: true,
    masterMenuItems: [
      {
        mdIconText: 'help',
        id: 'toggle-help',
        title: 'Show Help Box',
        action: 'openHelpModal',
      },
      {
        mdIconText: 'keyboard',
        id: 'toggle-input-assigner',
        title: 'Toggle auxiliary input fields',
        action: 'toggleAuxInputFields',
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
        mdIconText: 'save',
        id: 'save-settings',
        title: 'Save current parameter settings',
        action: 'openPresetAssigner',
      },

      // {
      //   mdIconText: 'wb_iridescent',
      //   id: 'set-background-strobe',
      //   tooltipText: 'Makes the background flash/strobe to the beat.',
      //   title: 'Enable Beat Strobe',
      //   function: '',
      // },
      // {
      //   mdIconText: 'waves',
      //   id: 'randomize-audio-reactive',
      //   tooltipText:
      //     "Randomizes all of the audio reactive selectors. This will assign each element's properties to respond to one of the frequency ranges.  This will also randomly set the audio reactive mode randomly for each of the elements' properties.",
      //   title: 'Randomize Audio Reactive',
      //   action: '',
      // },
    ],
  }),

  methods: {
    clickHandler(functionName) {
      console.log(functionName);
      this[functionName]();
    },

    randomizeComposition() {
      const indices = Object.keys(RegisteredSketches);
      BulkUpdateService.changeParameterValues(indices, 'randomize');
    },

    openHelpModal() {
      console.log(1);
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

<style lang="scss" scoped>
#settings-close {
  position: absolute;
  top: 0;
  right: 0;
}

#master-controls {
  width: 449px;
  position: fixed;
  z-index: 10;
  background: rgb(0, 0, 0);
  background: linear-gradient(180deg, rgba(0, 0, 0, 1) 66%, rgba(0, 0, 0, 0) 100%);
}

#master-controls .master-control-heading {
  color: #fff;
  margin: 15px 0 0 0;
  text-align: center;
}

#master-controls i.global-control {
  font-size: 30px;
}

#master-controls .icon-wrapper {
  padding: 0 20px;
  text-align: center;
}


</style>

<style lang="scss">
#composition-controls .inactive .v-icon.menu-icon {
  color: $color-inactive-red;
}

// to offset the lack of scrollbar
.pad-right {
  margin-right: 6px;
}

.master-dashboard-group-wrapper {
  margin: 15px auto;

  p {
    width: auto;
    margin: 0 auto;
    text-align: center;
  }
}


</style>
