<template lang="pug">
  #app-settings-menu

    v-dialog( v-model="loginDialog" max-width="600")
      v-card(  color="#000" elevation="10")
        v-card-title.headline Login
        v-card-text
          LoginPane()

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
      v-tooltip(
        v-for="(item, i) in preferences"
        :disabled="!userIsLoggedIn && item.title === 'Home'"
        :key="i"
        left
      )
        template( v-slot:activator= "{ on }")
          .hover-wrapper(
            v-on="on"
          )
            v-list-item(
              @click="clickHandler(item.action)"
              :disabled="!userIsLoggedIn && item.title !== 'Home'"
            )
              v-list-item-icon
                v-icon(
                  :class="{ 'disabled': !userIsLoggedIn && item.title !== 'Home' }"
                ) {{ item.icon }}
              v-list-item-content
                v-list-item-title( v-text="item.title")
        span {{ item.tooltipText }}
      v-list-item(
        v-show="!userIsLoggedIn"
        @click="loginDialog = true"
      )
        v-list-item-icon
          v-icon account_box
        v-list-item-content
          v-list-item-title Login


</template>

<script>
import LoginPane from '@/components/LoginPane.vue';

export default {
  components: {
    LoginPane
  },

  data: () => ({
    settingsOpen: false,
    loginDialog: false,

    preferences: [
      {
        title: 'Home',
        action: 'goToHome',
        icon: 'home',
        tooltipText: ''
      },
      {
        title: 'Save Session',
        action: 'saveSession',
        icon: 'save',
        tooltipText: 'Login to save your session'
      },
      {
        title: 'Open Session',
        action: 'openSession',
        icon: 'folder_open',
        tooltipText: 'Login to open a saved session'
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

  computed: {
    userIsLoggedIn() {
      const userObj = JSON.parse(localStorage.getItem('user'));
      return (userObj != null && userObj.loggedIn);
    },
  },
  mounted() {},
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

  i.disabled {
    color: $color-off-white;
  }
}
</style>
