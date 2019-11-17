<template lang="pug">
  .control-icon-wrapper()
    v-tooltip(
      right
    )
      template( v-slot:activator= "{ on }")
        i(
          :id='menuItemData.id'
          v-on="on"
          class="global-control material-icons md-light helper"
        ) {{ menuItemData.mdIconText }}
      span  {{ menuItemData.title }}
</template>

<script>
export default {
  name: 'CompositionControlItem',
  props: {
    menuItemData: {
      type: Object,
    },
  },
}
</script>
