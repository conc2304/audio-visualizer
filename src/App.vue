<template lang="pug">
  v-app
    v-content
      router-view
</template>

<script>
export default {
  name: 'App',
  components: {},
  data: () => ({}),
  events: {},
};
</script>

<style lang="scss">
html {
  overflow-y: hidden !important ;
}

#settings-menubar {
  i.menu-icon {
    color: $color-primary-blue;
    cursor: pointer;

    &.off {
      color: $color-std-grey;
    }
  }

  i.menu-icon:hover {
    color: $color-secondary-blue;
  }

  .active {
    border: 1px solid $color-secondary-blue;
  }

  i.menu-icon.inactive {
    color: $color-inactive-red-hover;
  }

  .inactive {
    i {
      color: $color-inactive-red;

      &:hover {
        color: $color-inactive-red-hover;
      }
    }
  }
}


</style>
