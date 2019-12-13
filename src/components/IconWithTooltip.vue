<template lang="pug">
  .control-icon-wrapper
    v-tooltip(
      right
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
export default {
  name: 'IconWithTooltip',

  data: () => ({
  }),

  props: {
    menuItemData: {
      type: Object,
    },
  },
}
</script>

<style scoped>
.control-icon-wrapper {
  margin: 0 auto;
}
</style>

<style lang="scss">

.v-tooltip__content {
  background-color: #000;
  border: 1px solid #555555
}
</style>
