<template lang="pug">
  #splash-container
    AppSettingsMenu

    #splash-sketch-background
    .content
      .title-bar
        h1 {{ title }}
        h2 {{ tagline }}
      .btn-wrapper
        v-btn(
          to="/playground"
          color="color_primary_blue"
          x-large

        ) To Playground
      .user-wrapper( v-if="!loginDisabled")
        .logged-in-wrapper( v-if="user.loggedIn && user.username != ''")
          p.username Welcome {{ user.username }} !
          v-btn(
            @click.stop="userLogout"
            color="color_primary_blue"
            outlined
            large

          ) Logout
        .logged-out-wrapper( v-else)
          v-btn(
            @click.stop="loginDialog = true"
            color="color_primary_blue"
            outlined
            large

          ) Login
      i#about.material-icons-outlined(
        @click.stop="infoDialog = true"
      ) info

    v-dialog( v-model="infoDialog" max-width="550")
      v-card.app-info(  color="#000" elevation="10")
        v-card-title.headline {{ dialogHeadline }}
        v-card-text
          p {{ dialogTagline }}
          ul
            li( v-for="(point, index) in dialogPoints" :key="index") {{ point }}
          .to-about
            v-btn( to="/playground"  large color="color_primary_blue" outlined) Go to Playground

    v-dialog( v-model="loginDialog" max-width="600")
      v-card(  color="#000" elevation="10")
        v-card-title.headline Login
        v-card-text
          LoginPane()
</template>

<script>
import ParticleScript from "@/js/sketches/SketchBaseHomePage";
import LoginPane from "@/components/LoginPane.vue";
import AppSettingsMenu from "@/components/AppSettingsMenu.vue";

export default {
  components: {
    AppSettingsMenu,
    LoginPane,
  },
  data: () => ({
    title: "VYZBY",
    tagline: "A visceral interactive digital canvas to play and create in.",
    loginDialog: false,
    infoDialog: false,
    user: {
      username: "",
      loggedIn: false,
    },
    dialogHeadline: "How to play",
    dialogTagline:
      "VYZBY is an interactive audio visualizer that let's you interact with it in many ways in the playground.",
    dialogPoints: [
      "Manually control the parameters of individual layers through the interface.",
      "Use your keyboard as an input and play it like piano,",
      "Customize the parameters to play to whatever key you choose.",
      "Use a MIDI device as your input device and make custom mappings.",
      "Add music to your play time from SoundCloud or Spotify or music off your computer.",
      "Select an audio frequency and automate the animation to the music.",
      "Use your body as a brush via the webcam.  ** Only available on some layers",
    ],
  }),
  methods: {
    updateUser(userObj) {
      this.user.username = userObj.username;
      this.user.loggedIn = userObj.loggedIn;
      this.loginDialog = false;
    },
    userLogout() {
      localStorage.removeItem("user");
      this.user.username = "";
      this.user.loggedIn = false;
    },
  },
  mounted() {
    const P5 = require("p5");
    // load p5 in instance mode
    const sketch = new P5(ParticleScript, "splash-sketch-background");

    const userObj = JSON.parse(localStorage.getItem("user"));
    if (userObj) {
      this.user.username = userObj.username;
      this.user.loggedIn = userObj.loggedIn;
    }
  },

  computed: {
    loginDisabled() {
      return this.$store.state.loginDisabled;
    },
  },
};
</script>

<style lang="scss" scoped>
#splash-container {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  display: flex;
  height: 100vh;
  padding: 0;
  margin: 0;
  overflow: hidden;
  background-color: #000;

  *::selection {
    background: rgba(0, 0, 0, 0); /* WebKit/Blink Browsers */
    color: $color-primary-blue;
  }
}

.content {
  z-index: 1;
}

.app-info {
  padding: 1.5rem;
}

#splash-sketch-background {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: absolute;
}

.title-bar {
  color: $color-primary-blue;
  text-align: center;
  margin-bottom: 2%;
}

h1 {
  font-family: "Montserrat", "sans-serif";
  font-weight: 900;
  font-size: 8.5rem;
  line-height: 1.5em;
}

h2 {
  font-family: "Roboto", "sans-serif";
  font-weight: 300;
  font-size: 2.5rem;
  line-height: 1.15em;
}

.btn-wrapper,
.user-wrapper {
  text-align: center;
}

.user-wrapper {
  margin: 10% auto;
}
.to-about {
  text-align: center;
  margin: 20px;
}

#about {
  font-size: 3rem;
  color: $color-primary-blue;
  display: block;
  margin: 20px 0;
  cursor: pointer;

  &:hover {
    color: $color-secondary-blue;
  }
}
.headline {
  text-align: center;
}
.username {
  font-size: 24px;
  color: $color-primary-blue;
}
</style>
