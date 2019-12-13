<template lang="pug">
  .menu-dash-group
    v-tooltip( right)
      template( v-slot:activator= "{ on }")
        v-list-item.no-padding(
          @click="presetDashVisible = !presetDashVisible"
        )
          p(
            v-on="on"
          ) Preset
            br
            span Slots
      span {{ presetDashVisible ? 'Hide' : 'Show' }} Preset Slot Selectors
    #preset-dash-button(
      v-show="presetDashVisible"
    )
      v-list( dense nav )
          v-list-item(
            @click="deleteSelectedPreset()"
            :disabled="presetSelectedIndex < 0"
            :class="presetSelectedIndex < 0 ? 'preset-empty' : ''"
          )
            v-icon() delete

      .preset-inner-wrapper( class="custom-thin-scrollbar")
        v-list(dense nav)
          v-list-item(
            v-for="(preset, i) in presetSlots"
            :key="i"
            @click="triggerPreset(i)"
            :disabled="preset.empty"
            :class="[preset.empty ? 'preset-empty' : 'preset-full', presetSelectedIndex === i ? 'active' : '']"
          )
            v-icon() {{ preset.iconText }}
</template>

<script>
export default {
  data: () => ({
    presetDashVisible: false,
  }),

  props: {
    presetSlots: {
      type: Array,
    },
    presetSelectedIndex: {
      type: Number,
      default: -1,
    },
  },

  methods: {
    triggerPreset(index) {
      // de-activate the selected preset on reclick
      if (index === this.presetSelectedIndex) {
        this.$emit('update_preset_selected', -1);
      } else {
        this.$emit('update_preset_selected', index);
      }

      if (this.presetSlots[index].empty === true) {
        console.log('preset empty');
      } else {
        console.log('trigger preset ' + index);
      }
    },

    deleteSelectedPreset() {
      this.presetSlots[this.presetSelectedIndex].empty = true;
      this.$emit('update_preset_selected', -1);
    },
  },
};
</script>

<style lang="scss" scoped>
.active {
  border: 1px solid $color-primary-blue;
}

.preset-full i {
  color: $color-primary-blue;
}

.preset-empty i {
  color: $color-off-white;
}
</style>
