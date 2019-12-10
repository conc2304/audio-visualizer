<template lang="pug">
  #splash-container
    #splash-sketch-background
    .content
      .title-bar
        h1 {{ title }}
        h2 {{ tagline }}
      .btn-wrapper
        v-btn(
          to='/visualizer'
          color="#0e83cd"
          x-large
          dark
        ) Go Play
      .user-wrapper
        .logged-in-wrapper( v-if="user.loggedIn && user.username != ''")
          p.username Welcome {{ user.username }} !
          v-btn(
            @click.stop="userLogout"
            color="#0e83cd"
            outlined
            large
            dark
          ) Logout
        .logged-out-wrapper( v-else)
          v-btn(
            @click.stop="loginDialog = true"
            color="#0e83cd"
            outlined
            large
            dark
          ) Login
        i#about.material-icons-outlined(
          @click.stop="infoDialog = true"
        ) info

    v-dialog( v-model="infoDialog" max-width="450")
      v-card( dark color="#000" elevation="10")
        v-card-title.headline {{ dialogHeadline }}
        v-card-text
          p {{ dialogTagline }}
          ul
            li( v-for="(point, index) in dialogPoints" :key="index") {{ point }}
          .to-about
            v-btn( to='/about' dark large color="#0e83cd" outlined) About

    v-dialog( v-model="loginDialog" max-width="450")
      v-card( dark color="#000" elevation="10")
        v-card-title.headline Login
        v-card-text
          LoginPane(
            v-on:user_login_event="updateUser"
            :userLoggedIn="user.loggedIn"
          )
</template>

<script>
import ParticleScript from '@/js/sketches/SketchBaseHomePage';
import LoginPane from '@/components/LoginPane.vue';

export default {
  components: {
    LoginPane,
  },
  data: () => ({
    title: 'VYZBY',
    tagline: 'A visceral interactive digital canvas to play and create in.',
    loginDialog: false,
    infoDialog: false,
    user: {
      username: '',
      loggedIn: false,
    },
    dialogHeadline: 'How to play',
    dialogTagline:
      "VYZBY is an interactive audio visualizer that let's you interact with in in many ways.",
    dialogPoints: [
      'Manually control the parameters of individual layers through the interface.',
      'Use your keyboard as an input and play it like piano,',
      'Customize the parameters to play to whatever key you choose.',
      'Use a MIDI device as your input device and make custom mappings.',
      'Add music to your sessiong by playing songs from SoundCloud or off your computer.',
      'Select an audio frequency and automate the animation to the music.',
      'Use your body as a brush via the webcam.  ** Only available on some layers',
    ],
  }),
  methods: {
    updateUser(userObj) {
      console.log('login complete');
      console.log(userObj);
      this.user.username = userObj.username;
      this.user.loggedIn = userObj.loggedIn;
      this.loginDialog = false;
    },
    userLogout() {
      console.log('test')
      localStorage.removeItem('user');
      this.user.username = '';
      this.user.loggedIn = false;
    },
  },
  mounted() {
    const P5 = require('p5');
    new P5(ParticleScript, 'splash-sketch-background');

    const userObj = JSON.parse(localStorage.getItem('user'));
    console.log('userObj');
    console.log(userObj);
    if (userObj) {
      this.user.username = userObj.username;
      this.user.loggedIn = userObj.loggedIn;
    }
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
}

.content {
  z-index: 1;
  *::selection {
    background: rgba(0, 0, 0, 0); /* WebKit/Blink Browsers */
    color: $color-primary-blue;
  }
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
  font-family: 'Montserrat', 'sans-serif';
  font-weight: 900;
  font-size: 8.5rem;
  line-height: 1.5em;
}

h2 {
  font-family: 'Roboto', 'sans-serif';
  font-weight: 300;
  font-size: 2.5rem;
  line-height: 1.15em;
}

.btn-wrapper, .user-wrapper {
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
  color: #fff;
}
</style>
