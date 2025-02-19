class Particle {
  constructor(p5, targetPartName = null) {
    this.bypass = false;

    // this.hue = new NumericProperty('Color', 'Color', 200, 0, 360, 0.1);
    // this.saturation = new NumericProperty('Saturation', 'Color', 100, 0, 100, 0.1);

    this.mX = 0;
    this.mY = 0;

    this.tHold = 200;
    this.drag = 0.00005;
    this.gravity =  3.15;
    this.gravityOn = true;
    this.targetPartName = targetPartName;

    this.velocityX = p5.random(0, 200);
    this.velocityY = p5.random(0, 2);
    this.pX = p5.random(-p5.windowWidth * 0.3, p5.windowWidth * 0.3);
    this.pY = p5.random(-p5.windowHeight * 0.3, p5.windowHeight * 0.3);

    this.X = p5.random(-p5.windowWidth * 0.1, p5.windowWidth * 0.1);
    this.Y = p5.random(-p5.windowHeight * 0.1, p5.windowHeight * 0.1);
    this.w = p5.random(1, this.tHold);
    this.wDelta = 0;

    this.render = function(x, y) {
      if (!this.gravityOn || p5.mouseIsPressed) {
        this.velocityX /= this.gravity;
        this.velocityY /= this.gravity;
      }
      this.velocityX += this.drag * (this.mX - this.X) * (this.w + this.wDelta);
      this.velocityY += this.drag * (this.mY - this.Y) * (this.w + this.wDelta);
      this.X += this.velocityX;
      this.Y += this.velocityY;

      p5.line(this.X, this.Y, this.pX, this.pY);

      this.pX = this.X;
      this.pY = this.Y;

      this.mX += 0.3 * (x - this.mX);
      this.mY += 0.3 * (y - this.mY);
    };
  }
}

Particle.prototype.draw = function(p5, x, y) {

  this.mX += 0.3 * (x - this.mX);
  this.mY += 0.3 * (y - this.mY);


  for (let i = 0; i < numParticles; i++) {
    bodies[i].render();
  }
};

export default Particle;
