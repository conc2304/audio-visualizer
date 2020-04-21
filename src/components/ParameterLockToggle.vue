<template lang="pug">
  .parameter-lock-toggle
    v-tooltip(
      right
    )
      template( v-slot:activator= "{ on }")
        v-btn(
          @click="toggleParameterLock()"
          text
          icon
        )
          v-icon.menu-icon(
            v-on="on"
            :class="{ 'inactive': parameter.lockOn }"
          ) {{ parameter.lockOn ? 'lock' : 'lock_open' }}
      span {{ parameter.lockOn ? 'Unlock' : 'Lock' }} parameter from being changed
</template>

<script>
export default {
  props: {
    parameter: {
      type: Object,
    },
  },

  methods: {
    toggleParameterLock() {
      this.parameter.lockOn = !this.parameter.lockOn;
    },
  },
};
</script>

<style lang="scss" scoped>
.parameter-lock-toggle {
  display: inline-block;
}
</style>
