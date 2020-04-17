<template lang="pug">
  v-snackbar(
      v-model="snackbarOpen"
      left
      multi-line
      :timeout=0
      vertical

    )
      p( class="text-center") Select a slot to save the current composition settings to a slot
      small( class="text-center") Selecting a full preset slot will override the slot
      br
      .preset-selector-wrapper
        v-list-item(
          @click="saveToPreset(i)"
          v-for="(preset, i) in presetSlots"
          :key="`preset-selector${i}`"
          :class=" preset.empty ? 'preset-empty' : 'preset-full'"

        )
          v-icon {{ preset.iconText }}
        v-list-item(
          @click="closeSnackBar()"

        )
          v-icon() close
        v-tooltip( top)
          template( v-slot:activator= "{ on }")
            v-list-item(
               @click="clearPresets()"
            )
              v-icon(
                v-on="on"

              ) delete
          span Clear All Presets
</template>

<script>
export default {
  props: {
    presetSlots: {
      type: Array,
      required: true,
    },
    snackbarOpen: {
      type: Boolean,
      required: true,
      default: false,
    },
  },

  data: () => ({
  }),

  methods: {
    saveToPreset(i) {
      this.presetSlots[i].empty = false;
      this.$emit('update_snackbar', false);
    },

    closeSnackBar() {
      this.$emit('update_snackbar', false);
    },

    clearPresets() {
      for (const i in this.presetSlots) {
        if (!this.presetSlots.hasOwnProperty(i)) {
          continue;
        }
        this.presetSlots[i].empty = true;
      }
      this.$emit('update_preset_selected', -1);
    }
  },
};
</script>

<style lang="scss" scoped>
.preset-full i {
  color: $color-primary-blue;
}

.preset-empty i {
  color: $color-off-white;
}
</style>
