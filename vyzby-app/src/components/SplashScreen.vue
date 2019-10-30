<template>
  <div id="splash-container">
    <div id="splash-sketch-background"></div>
    <div class="content">
      <div class="title-bar">
        <h1>{{ title }}</h1>
        <h2>{{ tagline}}</h2>
      </div>
      <div class="btn-wrapper">
        <v-btn @click.stop="changeLocation()" outlined x-large color="white">{{ buttonText }}</v-btn>
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
    class Ball {
      constructor(p5) {
        this.Xv = 0;
        this.Yv = 0;
        this.pX = 0;
        this.pY = 0;

        this.X = p5.random(p5.windowWidth);
        this.Y = p5.random(p5.windowHeight);
        this.w = p5.random(1 / thold, thold);

        this.render = function() {
          if (!p5.mouseIsPressed) {
            this.Xv /= spifac;
            this.Yv /= spifac;
          }
          this.Xv += drag * (mX - this.X) * this.w;
          this.Yv += drag * (mY - this.Y) * this.w;
          this.X += this.Xv;
          this.Y += this.Yv;
          p5.line(this.X, this.Y, this.pX, this.pY);
          this.pX = this.X;
          this.pY = this.Y;
        };
      }
    }

    let thold = 5;
    let spifac = 1.05;
    let drag = 0.001;
    let big = 500;
    let bodies = [];
    let mX = 0;
    let mY = 0;

    const script = function(p5) {
      p5.setup = _ => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.strokeWeight(1);
        p5.fill(255, 255, 255);
        p5.stroke(255, 255, 255, 5);
        p5.background(0, 0, 0);
        p5.smooth();
        for (let i = 0; i < big; i++) {
          console.log(i);
          bodies[i] = new Ball(p5);
        }
        console.log('stope');
        let traf = true;
      };
      // NOTE: Draw is here
      p5.draw = _ => {
        if (p5.mouseIsPressed) {
          console.log('test');
          p5.background(0, 0, 0);

          mX += 0.3 * (p5.mouseX - mX);
          mY += 0.3 * (p5.mouseY - mY);
        }
        mX += 0.3 * (p5.mouseX - mX);
        mY += 0.3 * (p5.mouseY - mY);
        for (let i = 0; i < big; i++) {
          bodies[i].render();
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

*::selection {
  // background: rgba(0,0,0,0); /* WebKit/Blink Browsers */
}

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
    background: rgba(0,0,0,0); /* WebKit/Blink Browsers */
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

.btn-wrapper {
  margin-top: 20%;
  text-align: center;
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
</style>
