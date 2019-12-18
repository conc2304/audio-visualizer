<template lang="pug">
  #app-settings-menu
    v-tooltip( left)
      template( v-slot:activator= "{ on }")
        v-icon.settings-btn(
          v-on="on"
          @click="settingsOpen = !settingsOpen"
        ) settings
      span  Preferences

    v-list.preferences-menu(
      v-show="settingsOpen"
      dense dark
    )
      v-list-item(
        v-for="(item, i) in preferences"
        @click="clickHandler(item.action)"
      )
        v-list-item-icon
          v-icon( v-text="item.icon")
        v-list-item-content
          v-list-item-title( v-text="item.title")


</template>

<script>
export default {
  data: () => ({
    settingsOpen: false,
    preferences: [
      {
        title: 'Home',
        action: 'goToHome',
        icon: 'home',
      },
      {
        title: 'Save Session',
        action: 'saveSession',
        icon: 'save',
      },
      {
        title: 'Open Session',
        action: 'openSession',
        icon: 'folder_open',
      },
    ],
  }),

  methods: {
    clickHandler(functionName) {
      this[functionName]();
    },

    openSession() {},

    saveSession() {},

    goToHome() {
      this.$router.push('/');
    },
  },
};
</script>

<style lang="scss" scoped>
#app-settings-menu {
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;

  .settings-btn {
    float: right;
    padding: 1rem;
    &:hover {
      color: $color-secondary-blue;
    }
    &:active {
      color: $color-primary-blue;
    }
  }

  .preferences-menu {
    clear: both;
  }
}
</style>
