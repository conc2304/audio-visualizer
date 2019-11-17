<template lang="pug">
  #layer-control-inner
    h2 Layer Controls
    v-expansion-panels( accordion multiple focusable)
      v-expansion-panel(
        v-for="(item,i) in 5"
        :key="i"
      )
        v-expansion-panel-header.layer-name Layer {{ i }}
          template( v-slot:actions)
            v-icon expand_more
        v-expansion-panel-content
          LayerControllerGroupDropown

</template>

<script>
import LayerControllerGroupDropown from '@/components/LayerControllerGroupDropown.vue';

export default {
  name: 'LayerControlProperties',
  components: {
    LayerControllerGroupDropown,
  },
  data: () => ({}),
};
</script>

<style lang="scss" scoped>
#layer-control-inner {
  width: 100%;

  .v-expansion-panel {
    background-color: transparent;
  }
}


.layer-name {
  font-size: 18px;
  font-weight: bold;
}

h2 {
  text-align: center;
}
</style>

<style lang="scss">

#layer-control-inner .v-expansion-panel-content__wrap {
  padding: 0;
}

.v-expansion-panel-header {
  border-radius: 0;
}
</style>
