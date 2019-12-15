import easeInto from '@/js/services/EasingService';
import NumericProperty from '@/js/services/PropertyConstructorNumeric';
import VariableProperty from '@/js/services/PropertyConstructorVariable';
import CatalogueDataEntry from '@/js/services/CatalogueDataEntry';

import SketchCatalogue from '@/js/services/SketchCatalogue';

class CenterWave {
  constructor(windowWidth, windowHeight, p5) {
    this.catalogueInfo = new CatalogueDataEntry(
      this.constructor,
      'Basic Sine Wave',
      'A simple parametric sine wave with various shapes as point along the wave.',
      ['Parametric', 'Awesome'],
      'NOTNOTclyzby',
      './assets/sketch_catalogue_gifs/center-wave_200.gif',
      300,
      2,
    );

    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.waveWidth = windowWidth + 200; // have some of it go off the page
    this.origin = 0;
    this.bypass = false;

    this.radius = new NumericProperty('Size', 'Base', 20, 0, 2000, 0.7);
    this.velocity = new NumericProperty('Velocity', 'Base', 0.025, 0, 1, 0.1);
    this.amplitude = new NumericProperty('Amplitude', 'Base', 75, 0, 2000, 0.1);
    this.period = new NumericProperty('Period', 'Base', 500, 0, 10250, 0.07);
    this.xSpacing = new NumericProperty('X Spacing', 'Base', 40, 1, 350, 0.1);

    this.waveRotateX = new NumericProperty('Rotate Wave X', 'Rotation', 0, -10, 10, 0.7);
    this.waveRotateY = new NumericProperty('Rotate Wave Y', 'Rotation', 0, -10, 10, 0.7);
    this.waveRotateZ = new NumericProperty('Rotate Wave Z', 'Rotation', 0, -10, 10, 0.7);

    this.hue = new NumericProperty('Color', 'Color', 200, 0, 360, 0.1);
    this.saturation = new NumericProperty('Saturation', 'Color', 100, 0, 100, 0.1);

    this.waveType = new VariableProperty('Wave Type', 'Base', 'sin', ['sin', 'cos', 'tan']);
    this.shape = new VariableProperty('Shape', 'Base', 'ellipse', [
      'line',
      'triangle',
      'square',
      'pentagon',
      'ellipse',
    ]);

    this.stroke = new VariableProperty('Outline and Fill', 'Color', 'Outline', [
      'Outline',
      'Filled',
    ]);
  }
}

/**
 * Based on the current wave period and spacing between x points
 * get the location of the y points to be rendered in the wave
 */
CenterWave.prototype.calcWave = function(p5) {
  const dx = (p5.TWO_PI / this.period.currentValue) * this.xSpacing.currentValue;

  this.waveType.currentValue = this.waveType.options.includes(this.waveType.currentValue)
    ? this.waveType.currentValue
    : 'sin';

  this.origin += this.velocity.currentValue;
  let x = this.origin;

  this.yPoints = new Array(Math.ceil(this.waveWidth / this.xSpacing.currentValue));

  for (let i = 0; i < this.yPoints.length; i++) {
    this.yPoints[i] = Math[this.waveType.currentValue](x) * this.amplitude.currentValue;
    x += dx;
  }
};

/**
 * Paint the object onto the screen based on the object's attributes.
 */
CenterWave.prototype.render = function(p5) {
  if (this.xSpacing.currentValue <= 0) {
    this.xSpacing.currentValue = this.xSpacing.min / 2;
  }
  this.yPoints = new Array(Math.ceil(this.waveWidth / this.xSpacing.currentValue));
  this.calcWave(p5);

  p5.push();
  this.rotateWave(p5);
  this.setColor(p5);
  for (let x = 0; x < this.yPoints.length; x++) {
    let xPos = x * this.xSpacing.currentValue - this.windowWidth / 2;
    let yPos = p5.height / 2 + this.yPoints[x] - this.windowHeight / 2;

    if (this.shake === true) {
      xPos += p5.noise(xPos) / this.noiseGain;
      yPos += p5.noise(yPos) / this.noiseGain;
    }

    this.renderShape(p5, xPos, yPos, this.radius.currentValue, p5);
  }
  p5.pop();
};

CenterWave.prototype.rotateWave = function(p5) {
  p5.rotateX(p5.frameCount * 0.01 * this.waveRotateX.currentValue);
  p5.rotateY(p5.frameCount * 0.01 * this.waveRotateY.currentValue);
  p5.rotateZ(p5.frameCount * 0.01 * this.waveRotateZ.currentValue);
};

/**
 * Sets the rotational speed along the X, Y, and Z axis of each shape
 */
CenterWave.prototype.rotateShape = function(p5) {
  p5.rotateX(p5.frameCount * 0.01 * this.rotateX.currentValue);
  p5.rotateY(p5.frameCount * 0.01 * this.rotateY.currentValue);
  p5.rotateZ(p5.frameCount * 0.01 * this.rotateZ.currentValue);
};

/**
 * Renders a given shape along the the passed x and y positions.
 * @param xPos
 * @param yPos
 * @param radius
 */
CenterWave.prototype.renderShape = function(p5, xPos, yPos, radius) {
  const polygons = ['line', 'triangle', 'square', 'pentagon']; // polygons we are allowing for set in the shape attribute

  p5.push();
  if (this.shape.currentValue === 'ellipse') {
    p5.ellipse(xPos, yPos, radius, radius);
  } else if (polygons.includes(this.shape.currentValue)) {
    let sides = 2;

    p5.strokeWeight(1);

    switch (this.shape.currentValue) {
      case 'line':
        sides = 2;
        p5.strokeWeight(2);
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

    p5.translate(xPos, yPos);
    p5.rotate(p5.sin(p5.frameCount / 50.0));
    p5.polygon(0, 0, radius, sides, p5);
  } else {
    p5.ellipse(xPos, yPos, radius, radius);
  }
  p5.pop();
};

/**
 * Based on user toggling, set the color profile for element to be rendered
 */
CenterWave.prototype.setColor = function(p5) {
  switch (this.stroke.currentValue) {
    case 'Outline':
      p5.strokeWeight(1);
      p5.stroke(this.hue.currentValue, this.saturation.currentValue, 100);
      p5.noFill();
      break;
    case 'Filled':
      p5.noStroke();
      p5.fill(this.hue.currentValue, this.saturation.currentValue, 100);
      break;
  }
};

CenterWave.prototype.easeInto = easeInto;

export default CenterWave;
