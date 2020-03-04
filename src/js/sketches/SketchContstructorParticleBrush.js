class Particle {
  constructor(p5) {
    this.bypass = false;

    // this.hue = new NumericProperty('Color', 'Color', 200, 0, 360, 0.1);
    // this.saturation = new NumericProperty('Saturation', 'Color', 100, 0, 100, 0.1);

    this.mX = 0;
    this.mY = 0;
    this.tHold = 400;
    this.drag = 0.005;
    this.gravity = 3.15;
    this.gravityOn = false;

    this.velocityX = p5.random(0, p5.windowWidth);
    this.velocityY = p5.random(0, p5.windowHeight);
    this.pX = p5.random(0, p5.windowWidth);
    this.pY = p5.random(0, p5.windowHeight);

    this.X = p5.random(0, p5.windowWidth);
    this.Y = p5.random(0, p5.windowHeight);
    this.w = p5.random(1 / this.tHold, this.tHold);

    this.render = function(x, y) {
      if (true || p5.mouseIsPressed || this.gravityOn) {
        this.velocityX /= this.gravity;
        this.velocityY /= this.gravity;
      }
      this.velocityX += this.drag * (this.mX - this.X) * this.w;
      this.velocityY += this.drag * (this.mY - this.Y) * this.w;
      this.X += this.velocityX;
      this.Y += this.velocityY;
      // console.log(this.X, this.Y);
      if (Number.isNaN(this.X)) {
        console.log(`this.velocityX : ${this.velocityX}`);
        console.log(`this.w : ${this.w}`);
      }
      p5.line(this.X, this.Y, this.pX, this.pY);
      p5.ellipse(this.X, this.Y, 2, 2);
      this.pX = this.X;
      this.pY = this.Y;

      this.mX += 0.3 * (x - this.mX);
      this.mY += 0.3 * (y - this.mY);
    };
  }
}

Particle.prototype.draw = function(p5, x, y) {
  // const red = p5.map(p5.sin(p5.frameCount * 0.05), 0, 1, 0, 255);

  this.mX += 0.3 * (x - this.mX);
  this.mY += 0.3 * (y - this.mY);

  console.log(`${mX}, ${mY}`);
  console.log(`${x}, ${y}`);

  for (let i = 0; i < numParticles; i++) {
    bodies[i].render();
  }
};

export default Particle;
