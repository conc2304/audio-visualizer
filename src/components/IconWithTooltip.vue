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
      span  {{ menuItemData.title }}
</template>

<script>
export default {
  props: {
    menuItemData: {
      type: Object,
    },
  },
};
</script>

<style lang="scss" scoped>
.control-icon-wrapper {
  margin: 0 auto;

  i, .v-icon {
    width: 24px;
    height: 24px;
  }
}
</style>

<style lang="scss">
.v-tooltip__content {
  background-color: #000;
  border: 1px solid #555555;
}
</style>
