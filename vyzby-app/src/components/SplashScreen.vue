<template>
  <div id="splash-container">
    <div class="title-bar">
      <h1>{{ title }}</h1>
      <h2>{{ tagline}}</h2>
    </div>
    <div class="btn-wrapper">
      <v-btn @click.stop="goPlay()" outlined color="white">{{ buttonText }}</v-btn>
      <i @click.stop="dialog = true" id="about" class="material-icons-outlined">info</i>
    </div>
    <v-dialog v-model="dialog" max-width="350">
      <v-card dark color="#000" elevation="10">
        <v-card-title class="headline">{{ dialogHeadline }}</v-card-title>
        <v-card-text>
          <p>{{ dialogTagline }}</p>
          <ul>
            <li v-for="(point, index) in dialogPoints" :key="index">{{ point }}</li>
          </ul>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

function goPlay() {
  this.$emit('loc-change', 'main');
}

export default {
  data: () => ({
    title: 'VYZBY',
    tagline: 'A visceral interactive digital canvas to play and create in.',
    buttonText: 'Go Play',
    dialog: false,
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
    goPlay,
  },
};

</script>

<style lang="scss" scoped>
#splash-container {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
  background-color: #000;
}

.title-bar {
  margin-top: 20%;
  color: $color-primary-blue;
  text-align: center;
}

h1 {
  font-family: 'Montserrat', 'sans-serif';
  font-weight: 900;
  font-size: 6.5rem;
  line-height: 1.5em;
}

h2 {
  font-family: 'Roboto', 'sans-serif';
  font-weight: 300;
  font-size: 1.5rem;
  line-height: 1.15em;
}

.btn-wrapper {
  margin-top: 20%;
  text-align: center;
}

#about {
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
</style>
