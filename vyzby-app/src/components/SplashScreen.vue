<template>
  <div id="splash-container">
    <div id="splash-sketch-background"></div>
    <div class="content">
      <div class="title-bar">
        <h1>{{ title }}</h1>
        <h2>{{ tagline}}</h2>
      </div>
      <div class="btn-wrapper">
        <v-btn @click.stop="changeLocation()" outlined color="white">{{ buttonText }}</v-btn>
        <i @click.stop="dialog = true" id="about" class="material-icons-outlined">info</i>
      </div>
    </div>

    <v-dialog v-model="dialog" max-width="450">
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
function changeLocation() {
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
    changeLocation,
  },
  mounted() {
    console.log('mounted');
    const script = function(p5) {
      let speed = 2;
      let posX = 0;

      // NOTE: Set up is here
      p5.setup = _ => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.ellipse(p5.width / 2, p5.height / 2, 500, 500);
      };
      // NOTE: Draw is here
      p5.draw = _ => {
        p5.background(0);
        const degree = p5.frameCount * 3;
        const y = p5.sin(p5.radians(degree)) * 50;

        p5.push();
        p5.translate(0, p5.height / 2);
        p5.ellipse(posX, y, 50, 50);
        p5.pop();
        posX += speed;

        if (posX > p5.width || posX < 0) {
          speed *= -1;
        }
      };
    };
    // NOTE: Use p5 as an instance mode
    const P5 = require('p5');
    new P5(script, 'splash-sketch-background');
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
