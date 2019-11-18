<template lang="pug">
  v-list( dense nav)
    v-list-item(
      v-for="menuItemData in masterMenuItems"
      :key="menuItemData.title"
      @click=""
    )
      IconWithTooltip(
        :menuItemData='menuItemData'
      )
</template>

<script>
import IconWithTooltip from '@/components/IconWithTooltip.vue';

export default {
  components: {
    IconWithTooltip,
  },
  data: () => ({
    masterMenuItems: [
      {
        mdIconText: 'close',
        id: 'close-menu',
        tooltipText: 'Close the Layer Controller Menu',
        title: 'Close Menu',
        function: '',
      },
      {
        mdIconText: 'help',
        id: 'toggle-help',
        tooltipText:
          'Enable or Disable this help box. The help box will tell you what each intractable element does.',
        title: 'Toggle Help',
        function: '',
      },
      {
        mdIconText: 'keyboard',
        id: 'toggle-input-assigner',
        tooltipText:
          'This will show/hide the fields that allow you to map and bind keyboard keys and/or midi controller inputs to control visual properties.',
        title: 'Toggle the Input Binders',
        function: '',
      },
      {
        mdIconText: 'waves',
        id: 'randomize-audio-reactive',
        tooltipText:
          "Randomizes all of the audio reactive selectors. This will assign each element's properties to respond to one of the frequency ranges.  This will also randomly set the audio reactive mode randomly for each of the elements' properties.",
        title: 'Randomize Audio Reactive',
        function: '',
      },
      {
        mdIconText: 'shuffle',
        id: 'randomize-settings',
        tooltipText:
          'Randomizes all values for every element and property. Excludes audio reactive control',
        title: 'Randomize Everything',
        function: '',
      },
      {
        mdIconText: 'wb_iridescent',
        id: 'set-background-strobe',
        tooltipText: 'Makes the background flash/strobe to the beat.',
        title: 'Enable Beat Strobe',
        function: '',
      },
      {
        mdIconText: 'restore',
        id: 'reset-settings',
        tooltipText: 'Reset All Values. Excludes audio reactive control',
        title: 'Master Reset',
        function: '',
      },
    ],
  }),
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
