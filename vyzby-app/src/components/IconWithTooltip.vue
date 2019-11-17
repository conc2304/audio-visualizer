<template lang="pug">
  .control-icon-wrapper()
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
  props: {
    menuItemData: {
      type: Object,
    },
  },
}
</script>

<style lang="scss" scoped>
i.menu-icon {
  color: $color-primary-blue;
  cursor: pointer;
}

i.menu-icon.inactive {
  color: $color-inactive-red-hover;
}

i.menu-icon.inactive:hover {
  color: $color-inactive-red
}

i.menu-icon:hover {
  color: $color-secondary-blue;
}

.v-tooltip__content {
  background-color: #000;
  border: 1px solid #555555
}
</style>
