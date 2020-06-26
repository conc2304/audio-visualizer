<template lang="pug">
  v-app#app
    v-content
      router-view
</template>

<style lang="scss">
html {
  overflow-y: hidden !important ;
}

body {
  margin: initial;
}

#settings-menubar {
  i.menu-icon, .v-icon.menu-icon {
    color: $color-primary-blue;
    cursor: pointer;

    &.off {
      color: $color-off-white;
    }
  }

  i.menu-icon:hover, .v-icon.menu-icon:hover  {
    color: $color-secondary-blue;
  }

  .active {
    border: 1px solid $color-secondary-blue;
  }

  i.menu-icon.inactive, .v-icon.menu-icon.inactive {
    color: $color-inactive-red-hover;
  }

  .inactive {
    i, .v-icon{
      color: $color-inactive-red-hover;

      &:hover {
        color: $color-inactive-red-hover;
      }
    }
  }
}


</style>
