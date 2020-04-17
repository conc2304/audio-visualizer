<template lang="pug">
  #app-preferences-wrapper
    .preferences-overlay(
      v-show="settingsOpen"
      @click="settingsOpen = false"
    )

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

        v-list-item( @click="goToHome()")
          v-list-item-icon
            v-icon home
          v-list-item-content
            v-list-item-title Home

        v-list-item( @click="redirectToMain()")
          v-list-item-icon
            v-icon computer
          v-list-item-content
            v-list-item-title JoseConchello.com

        v-list-item( @click="toGithub()" )
          v-list-item-icon
            v-img.custom-icon(
              src="/assets/icons/GitHub-Mark-Light-32px.png"
              contain
              height="24px"
              width="24px"
            )
          v-list-item-content
            v-list-item-title Visit Github Repo

        v-list-item( @click="toggleFullscreen()" )
          v-list-item-icon
            v-icon(
            ) {{ fullscreenOn ? 'fullscreen' : 'fullscreen_exit' }}
          v-list-item-content
            v-list-item-title {{ fullscreenOn ? 'Exit Fullscreen' : 'Fullscreen' }}


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
                    v-list-item-title  session_{{ i }}.vyzby


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
    userIsLoggedIn: true,
    settingsOpen: false,
    loginDialog: false,
    openSessionDialog: false,
    saveSessionDialog: false,
    sessionName: '',
    savedSessionName: '',
    fullscreenOn: false,
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
      this.userIsLoggedIn = false;
    },

    submit() {
      this.saveSessionDialog = false;
    },

    toggleFullscreen() {
      if (this.fullscreenOn) {
        this.closeFullscreen();
        this.fullscreenOn = false;
      } else {
        this.openFullscreen();
        this.fullscreenOn = true;
      }
    },

    toGithub() {
      window.open('https://github.com/conc2304/audio-visualizer');
    },

    redirectToMain() {
      window.location = 'http://www.joseconchello.com/';
    },

    openFullscreen() {
      const elem = document.documentElement;

      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
    },

    closeFullscreen() {
      this.fullscreenOn = false;

      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
      }
    },
  },

  validations: {
    sessionName: { required, minLength: minLength(6) },
  },

  computed: {
    loginDisabled() {
      return this.$store.state.loginDisabled;
    },

    sessionNameErrors() {
      const errors = [];
      if (!this.$v.sessionName.$dirty) return errors;
      const requiredValid = !this.$v.sessionName.required && errors.push('Session Name is required.');
      const minLengthValid = !this.$v.sessionName.minLength &&
        errors.push('Session Name must be at least 6 characters long');
      return errors;
    },
  },
  mounted() {
    const userObj = JSON.parse(localStorage.getItem('user'));
    this.userIsLoggedIn = userObj != null && userObj.loggedIn;
  },
};
</script>

<style lang="scss" scoped>
.preferences-overlay {
  z-index: 5;
  position: fixed;
  background-color: #000;
  opacity: 0.33;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}

#app-settings-menu {
  position: absolute;
  z-index: 6;
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
