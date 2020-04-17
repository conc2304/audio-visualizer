const tHold = 500;
const gravity = 3.15;
const drag = 0.001;
let mX = 0;
let mY = 0;

class Particle {
  constructor(p5) {
    this.Xv = p5.random(0, p5.windowWidth);
    this.Yv = p5.random(0, p5.windowHeight);
    this.pX = p5.random(0, p5.windowWidth);
    this.pY = p5.random(0, p5.windowHeight);

    this.X = p5.random(0, p5.windowWidth);
    this.Y = p5.random(0, p5.windowHeight);
    this.w = p5.random(1 / tHold, tHold);

    this.render = function () {
      if (!p5.mouseIsPressed) {
        this.Xv /= gravity;
        this.Yv /= gravity;
      }
      this.Xv += drag * (mX - this.X) * this.w;
      this.Yv += drag * (mY - this.Y) * this.w;
      this.X += this.Xv;
      this.Y += this.Yv;
      p5.line(
        this.X,
        this.Y,
        this.pX,
        this.pY,
      );
      this.pX = this.X;
      this.pY = this.Y;
    };
  }
}

const numParticles = 250;
const bodies = [];

const ParticleScript = function(p5) {
  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.strokeWeight(1);
    p5.background(0, 0, 0);
    p5.smooth();
    for (let i = 0; i < numParticles; i++) {
      bodies[i] = new Particle(p5);
    }
  };

  p5.draw = () => {
    p5.background(0, 0, 0, 30);

    const red = p5.map(p5.sin(p5.frameCount * 0.05), 0, 1, 0, 255);
    p5.stroke(red, 255, 255, 100);

    mX += 0.3 * (p5.mouseX - mX);
    mY += 0.3 * (p5.mouseY - mY);

    for (let i = 0; i < numParticles; i++) {
      bodies[i].render();
    }
  };

  p5.windowResized = () => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };
};

export default ParticleScript;
