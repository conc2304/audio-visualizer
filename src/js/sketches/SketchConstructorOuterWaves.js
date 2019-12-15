import easeInto from '@/js/services/EasingService';
import NumericProperty from '@/js/services/PropertyConstructorNumeric';
import VariableProperty from '@/js/services/PropertyConstructorVariable';
import SketchCatalogue from '@/js/services/SketchCatalogue';
import CatalogueDataEntry from '@/js/services/CatalogueDataEntry';

class OuterWaves {
  constructor(windowWidth, windowHeight, p5) {
    this.catalogueInfo = new CatalogueDataEntry(
      this.constructor,
      'Sine Wave Set',
      'A group of parametric sine waves with various shapes as point along the wave.',
      ['Parametric'],
      'clyzby',
      './assets/sketch_catalogue_gifs/outer-waves_200.gif',
      202,
      4,
    );

    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.waveWidth = windowWidth + 200; // have some of it go off the page
    this.origin = 0;
    this.bypass = false;

    this.shake = false;
    this.shakeGain = 0.009; // should be make this a dial/ controllable by button

    this.numWaves = new NumericProperty('Number of Waves', 'Base', 3, 0, 9, 0.5);
    this.radius = new NumericProperty('Size', 'Base', 10, 0, 200, 0.5);
    this.velocity = new NumericProperty('Velocity', 'Base', 0.025, 0.02, 0.5, 0.1);
    this.amplitude = new NumericProperty('Amplitude', 'Base', 75, 0, 500, 0.1);
    this.period = new NumericProperty('Period', 'Base', 1000, 0, 2250, 0.07);
    this.xSpacing = new NumericProperty('X Spacing', 'Base', 40, 15, 350, 0.1);
    this.ySpacing = new NumericProperty('Y Spacing', 'Base', 40, 5, 350, 0.1);
    this.waveType = new VariableProperty('Wave Type', 'Base', 'sin', ['sin', 'cos', 'tan']);
    this.shape = new VariableProperty('Shape', 'Base', 'ellipse', [
      'line',
      'triangle',
      'square',
      'pentagon',
      'ellipse',
    ]);

    this.waveRotateX = new NumericProperty('Rotate Wave X', 'Rotation', 0, -10, 10, 0.7);
    this.waveRotateY = new NumericProperty('Rotate Wave Y', 'Rotation', 0, -10, 10, 0.7);
    this.waveRotateZ = new NumericProperty('Rotate Wave Z', 'Rotation', 0, -10, 10, 0.7);

    this.hue = new NumericProperty('Color', 'Color', 200, 0, 360, 0.1);
    this.saturation = new NumericProperty('Saturation', 'Color', 100, 0, 100, 0.1);
    this.stroke = new VariableProperty('Outline and Fill', 'Color', 'Outline', [
      'Outline',
      'Filled',
    ]);

    this.yPoints = new Array(Math.floor(this.waveWidth / this.xSpacing.currentValue));
  }
}

/**
 * Based on the current wave period and spacing between x points
 * get the location of the y points to be rendered in the wave
 */
OuterWaves.prototype.calcWave = function(p5) {
  const dx = (p5.TWO_PI / this.period.currentValue) * this.xSpacing.currentValue;
  this.waveType.currentValue = this.waveType.options.includes(this.waveType.currentValue)
    ? this.waveType.currentValue
    : 'sin';
  this.origin += this.velocity.currentValue;
  let x = this.origin;
  for (let i = 0; i < this.yPoints.length; i++) {
    this.yPoints[i] = Math[this.waveType.currentValue](x) * this.amplitude.currentValue;
    x += dx;
  }
};

/**
 * Paint the object onto the screen based on the object's attributes.
 */
OuterWaves.prototype.render = function(p5) {
  if (this.xSpacing.currentValue <= 0) {
    this.xSpacing.currentValue = this.xSpacing.min / 2;
  }
  this.yPoints = new Array(Math.floor(this.waveWidth / this.xSpacing.currentValue));
  this.calcWave(p5);

  p5.push();
  this.rotateWave(p5);
  this.setColor(p5);
  let m, r, s;
  for (let i = 0; i < this.numWaves.currentValue; i++) {
    // make each one 15% smaller
    m = this.radius.currentValue * 0.15 * (i + 1);
    r = this.radius.currentValue - m;
    s = this.ySpacing.currentValue * 2.5 * (i + 1);

    for (let x = 0; x < this.yPoints.length; x++) {
      let xPos = x * this.xSpacing.currentValue - p5.windowWidth / 2;
      let yPos = p5.height / 2 + this.yPoints[x] - p5.windowHeight / 2;

      if (this.shake === true) {
        xPos += p5.noise(xPos) / this.noiseGain;
        yPos += p5.noise(yPos) / this.noiseGain;
      }

      this.renderShape(xPos, yPos, r, s, p5);
    }
  }
  p5.pop();
};

/**
 * Sets the rotational speed along the X, Y, and Z axis of the individual wave.
 */
OuterWaves.prototype.rotateWave = function(p5) {
  p5.rotateX(p5.frameCount * 0.01 * this.waveRotateX.currentValue);
  p5.rotateY(p5.frameCount * 0.01 * this.waveRotateY.currentValue);
  p5.rotateZ(p5.frameCount * 0.01 * this.waveRotateZ.currentValue);
};

/**
 * Based on user toggling, set the color profile for element to be rendered
 */
OuterWaves.prototype.setColor = function(p5) {
  switch (this.stroke.currentValue) {
    case 'Outline':
      p5.stroke(this.hue.currentValue, this.saturation.currentValue, 100);
      p5.noFill();
      break;
    case 'Filled':
      p5.noStroke();
      p5.fill(this.hue.currentValue, this.saturation.currentValue, 100);
      break;
  }
};

/**
 * Renders a given shape along the the passed x and y positions.
 * @param xPos
 * @param yPos
 * @param radius
 * @param spacing  - y space between lines
 */
OuterWaves.prototype.renderShape = function(xPos, yPos, radius, spacing, p5) {
  const polygons = ['line', 'triangle', 'square', 'pentagon']; // polygons we are allowing for set in the shape attribute

  if (this.shape.currentValue === 'ellipse') {
    p5.ellipse(xPos, yPos + spacing, radius, radius); // one above and one below
    p5.ellipse(xPos, yPos - spacing, radius, radius);
  } else if (polygons.includes(this.shape.currentValue)) {
    let sides;
    switch (this.shape.currentValue) {
      case 'line':
        sides = 2;
        break;
      case 'triangle':
        sides = 3;
        break;
      case 'square':
        sides = 4;
        break;
      case 'pentagon':
        sides = 5;
        break;
    }
    p5.push();
    p5.strokeWeight(3);
    p5.translate(xPos, yPos + spacing);
    p5.rotate(p5.atan(p5.frameCount / 50.0));
    p5.polygon(0, 0, radius, sides, p5);
    p5.pop();

    p5.push();
    p5.strokeWeight(3);
    p5.translate(xPos, yPos - spacing);
    p5.rotate(p5.atan(p5.frameCount / -50.0));
    p5.polygon(0, 0, radius, sides, p5);
    p5.pop();
  } else {
    p5.ellipse(xPos, yPos + spacing, radius, radius); // one above and one below
    p5.ellipse(xPos, yPos - spacing, radius, radius);
  }
};

/**
 * For each attribute transition from the current value to the target value
 */
OuterWaves.prototype.easeInto = easeInto;

export default OuterWaves;
