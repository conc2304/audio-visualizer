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

export default {
  components: {
    IconWithTooltip,
  },

  props: {
    sketchIndexSelected: {
      type: Number,
    },
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
      {
        mdIconText: 'waves',
        tooltipText: 'Randomize Audio Responsiveness',
        title: 'Randomize Audio Responsiveness',
        action: 'randomizeAudioResponse',
      },
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

    resetLayer() {
      console.log('Reset Layer');

      let index = this.sketchIndexSelected;
      let ctrlElementsArray = [this.RegisteredSketches[index]];

      // randomizeAudioResponsiveOption(false, true);
      // randomizeAudioFrequency(false, true);

      let globalReset = true;
      for (let i in ctrlElementsArray) {
        if (!ctrlElementsArray.hasOwnProperty(i)) {
          continue;
        }

        let ctrlElem = ctrlElementsArray[i];

        for (let prop in ctrlElem) {
          if (!ctrlElem.hasOwnProperty(prop)) {
            continue;
          }

          if (!ctrlElem[prop].defaultValue || !ctrlElem[prop].currentValue) {
            continue;
          }

          if (ctrlElem[prop].lockOn === true) {
            continue;
          }

          if (ctrlElem[prop].attrType === 'numeric') {
            this.RegisteredSketches[index][prop].currentValue = this.RegisteredSketches[index][
              prop
            ].defaultValue;
            this.RegisteredSketches[index][prop].targetValue = this.RegisteredSketches[index][
              prop
            ].defaultValue;
            this.RegisteredSketches[index][prop].min = this.RegisteredSketches[index][
              prop
            ].defaultMin;
            this.RegisteredSketches[index][prop].max = this.RegisteredSketches[index][
              prop
            ].defaultMax;
          } else if (ctrlElem[prop].attrType === 'variable') {
            this.RegisteredSketches[index][prop].currentValue = this.RegisteredSketches[index][
              prop
            ].defaultValue;
          }

          if (globalReset === true) {
            this.RegisteredSketches[index][prop].lockOn = false;
          }
        }
      }

      this.$emit('layer_action_triggered');
    },

    randomizeAudioResponse() {
      console.log('Randomize Audio');

      this.$emit('layer_action_triggered');
    },

    randomizeLayerParameters() {
      console.log('randomizeParameters');

      const index = this.sketchIndexSelected;
      const ctrlElementsArray = [this.RegisteredSketches[index]];

      let rVal;
      let valueRange;
      let optLength;
      let optIndex;

      for (let i in ctrlElementsArray) {
        if (!ctrlElementsArray.hasOwnProperty(i)) {
          continue;
        }

        const ctrlElem = ctrlElementsArray[i];

        for (let prop in ctrlElem) {
          if (
            !ctrlElem.hasOwnProperty(prop) ||
            !ctrlElem[prop].defaultValue ||
            !ctrlElem[prop].currentValue
          ) {
            continue;
          }

          if (ctrlElem[prop].lockOn === true) {
            continue;
          }

          if (ctrlElem[prop].attrType === 'numeric') {
            rVal =
              Math.random() *
              (
                parseFloat(ctrlElem[prop].max) -
                parseFloat(ctrlElem[prop].min) +
                parseFloat(ctrlElem[prop].min)
              ).toFixed(4);
          } else if (ctrlElem[prop].attrType === 'variable') {
            optLength = ctrlElem[prop].options.length;
            optIndex = getRandomInt(0, optLength - 1);
            rVal = ctrlElem[prop].options[optIndex];

            if (typeof rVal === 'undefined') {
              console.log('stop');
            }
          }

          this.RegisteredSketches[index][prop].currentValue = rVal;
          this.RegisteredSketches[index][prop].targetValue = rVal;
        }
      }

      this.$emit('layer_action_triggered');
    },

    toggleLayerVisibility() {
      const index = this.sketchIndexSelected;
      const bypassStatus = !this.RegisteredSketches[index].bypass;
      this.RegisteredSketches[index].bypass = bypassStatus;
      this.layerDashboardActions[0].mdIconText = bypassStatus ? 'visibility_off' : 'visibility';
    },
  },
};

let getRandomInt = (min, max) => {
  'use strict';
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
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

  i.menu-icon {
    color: $color-primary-blue;
    cursor: pointer;
  }

  i.menu-icon.inactive {
    color: $color-inactive-red-hover;
  }

  i.menu-icon.inactive:hover {
    color: $color-inactive-red;
  }

  i.menu-icon:hover {
    color: $color-secondary-blue;
  }

  .v-tooltip__content {
    background-color: #000;
    border: 1px solid #555555;
  }
}
</style>
