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
        :disabled="item.title === 'Home' || (item.title !== 'Home' && !userIsLoggedIn ) "
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
        @click="userIsLoggedIn ? userLogout : loginDialog = true"
      )
        v-list-item-icon
          v-icon account_box
        v-list-item-content
          v-list-item-title {{ userIsLoggedIn ? 'Logout' : 'Login'}}


    v-dialog( v-model="openSessionDialog" max-width="300")
      v-card(  color="#000" elevation="10")
        v-card-title.headline Open existing session
          v-card-text
            v-list()
              v-list-item(
                v-for="(session, i) in 5"
                :key="i"
              )
                v-list-item-icon(
                  @click="openSessionDialog = false"
                )
                  v-icon insert_drive_file
                v-list-item-content
                  v-list-item-title  session_{{ i }}


    v-dialog( v-model="saveSessionDialog" max-width="400")
      v-card(  color="#000" elevation="10")
        v-card-title.headline Save Session
          v-card-text
            v-form(
              @submit.prevent="submit"
              class="ma-2"
            )
              v-row
                v-col(md="12")
                  v-text-field(
                    label="Save Your Current Session"
                    prepend-inner-icon="attach_file"
                    v-model.trim="sessionName"
                    :error-messages="sessionNameErrors"
                    @input="$v.sessionName.$touch()"
                    @blur="$v.sessionName.$touch()"
                    required
                  )
              v-row
                v-col( class="mx-auto" md="4")
                  v-btn(
                    type="submit"
                    required
                    large color="color_primary_blue" outlined
                  ) Save


</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators';
import LoginPane from '@/components/LoginPane.vue';

export default {
  components: {
    LoginPane,
  },

  data: () => ({
    settingsOpen: false,
    loginDialog: false,
    openSessionDialog: false,
    saveSessionDialog: false,
    sessionName: '',
    savedSessionName: '',

    preferences: [
      {
        title: 'Home',
        action: 'goToHome',
        icon: 'home',
        tooltipText: '',
      },
      {
        title: 'Save Session',
        action: 'saveSession',
        icon: 'save',
        tooltipText: 'Login to save your session',
      },
      {
        title: 'Open Session',
        action: 'openSession',
        icon: 'folder_open',
        tooltipText: 'Login to open a saved session',
      },
    ],
  }),

  methods: {
    clickHandler(functionName) {
      this[functionName]();
    },

    openSession() {
      this.openSessionDialog = true;
    },

    saveSession() {
      this.saveSessionDialog = true;
    },

    goToHome() {
      this.$router.push('/');
    },

    userLogout() {
      localStorage.removeItem('user');
    },

    submit() {
      this.saveSessionDialog = false;
    },
  },

  validations: {
    sessionName: { required, minLength: minLength(6) },
  },

  computed: {
    userIsLoggedIn() {
      const userObj = JSON.parse(localStorage.getItem('user'));
      return userObj != null && userObj.loggedIn;
    },

    sessionNameErrors() {
      const errors = [];
      if (!this.$v.sessionName.$dirty) return errors;
      !this.$v.sessionName.required && errors.push('Session Name is required.');
      !this.$v.sessionName.minLength && errors.push('Session Name must be at least 6 characters long');
      return errors;
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
