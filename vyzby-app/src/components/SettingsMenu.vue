<template lang="pug">
  //- #settings-menu
  //-   CompositionControls

  v-card#settings-menu(
    class="mx-auto"
    width="330"
    dark
  )
    v-navigation-drawer(
      permanent
      width="100%"
    )
      v-row( class="fill-height" no-gutters)
        v-navigation-drawer(
          dark
          mini-variant
          mini-variant-width="56"
          permanent
        )
          v-list-item( to="/")
            v-icon home

          v-divider

          CompositionControls

        v-list#layer-control-menu.grow
          v-list-item(
            v-for="link in links"
            :key="link"
            link
          )
            v-list-item-title( v-text="link")
</template>

<script>
import CompositionControls from '@/components/CompositionControls.vue';

export default {
  components: {
    CompositionControls,
  },
  data: () => ({}),
};
</script>

<style lang="scss" scoped>
#settings-menu::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  background-color: #f5f5f5;
  background-color: #f5f5f5;
  border-radius: 10px;
}

#settings-menu::-webkit-scrollbar {
  width: 10px;
  background-color: #f5f5f5;
}

@media (min-width: 320px) and (max-width: 480px) {
  #settings-menu::-webkit-scrollbar {
    width: 20px;
  }

  #settings-menu {
    padding-left: 35px;
  }
}

#settings-menu::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #000000bd;
  background-image: -webkit-gradient(
    linear,
    40% 0%,
    75% 84%,
    from(#000000bd),
    to(#0c6b98),
    color-stop(0.9, #0e83cd)
  );
}

#settings-menu::-webkit-scrollbar-track {
  background-color: #000;
}

#settings-menu {
  // display: none;
  position: absolute;
  width: 450px;
  top: 0;
  bottom: 0;
  left: 0;
  background-color: #000000bd;
  overflow-y: scroll;
  border-right: 1px solid #292929;
}

#layer-control-menu {
  background-color: #000000bd;
  overflow-y: scroll;
  border-right: 1px solid #292929;
}
</style>
