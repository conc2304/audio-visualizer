import easeInto from '@/js/services/EasingService';
import Utils from '@/js/services/Utils';
import NumericProperty from '@/js/services/PropertyConstructorNumeric';
import VariableProperty from '@/js/services/PropertyConstructorVariable';
import CatalogueDataEntry from '@/js/services/CatalogueDataEntry';

import SketchCatalogue from '@/js/services/SketchCatalogue';

class WEBGLWave {
  constructor(windowWidth, windowHeight) {

    this.sid = Utils.guidGenerator();

    this.catalogueInfo = new CatalogueDataEntry(
      this.constructor,
      'WEBGL Sine Wave',
      'A parametric sine wave with various 3D shapes as point along the wave.',
      ['Parametric', 'WEBGL'],
      'clyzby',
      './assets/sketch_catalogue_gifs/webgl-wave_200.gif',
      277,
      4,
    );

    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.waveWidth = windowWidth + 200; // have some of it go off the page
    this.origin = 0;
    this.bypass = false;

    this.shake = false;
    this.shakeGain = 0.009; // should be make this a dial/ controllable by button

    this.radius = new NumericProperty('Size', 'Base', 20, 15, 150, 0.7);
    this.elemQty = new NumericProperty('Number of Shapes', 'Base', 1, 1, 20, 0.7);
    this.xSpacing = new NumericProperty('X Spacing', 'Base', 300, 0, 900, 0.7);
    this.amplitude = new NumericProperty('Amplitude', 'Base', 75, 0, 500, 0.7);
    this.period = new NumericProperty('Period', 'Base', 500, 0, 850, 0.7);
    this.velocity = new NumericProperty('Velocity', 'Base', -0.001, 0.005, 0.2, 0.7);

    this.rotateX = new NumericProperty('Rotate Shape X', 'Rotation', 0, -10, 10, 0.7);
    this.rotateY = new NumericProperty('Rotate Shape Y', 'Rotation', 0, -10, 10, 0.7);
    this.rotateZ = new NumericProperty('Rotate Shape Z', 'Rotation', 0, -10, 10, 0.7);
    this.waveRotateX = new NumericProperty('Rotate Wave X', 'Rotation', 0, -10, 10, 0.7);
    this.waveRotateY = new NumericProperty('Rotate Wave Y', 'Rotation', 0, -10, 10, 0.7);
    this.waveRotateZ = new NumericProperty('Rotate Wave Z', 'Rotation', 0, -10, 10, 0.7);

    this.translateX = new NumericProperty('Translate X', 'Position', 0, -900, 900, 0.7);
    this.translateY = new NumericProperty('Translate Y', 'Position', 0, -900, 900, 0.7);
    this.translateZ = new NumericProperty('Translate Z', 'Position', 0, -900, 900, 0.7);

    this.strokeHue = new NumericProperty('Line Color', 'Color', 200, 0, 360, 0.7);
    this.fillHue = new NumericProperty('Fill Color', 'Color', 200, 0, 360, 0.7);
    this.saturation = new NumericProperty('Saturation', 'Color', 100, 0, 100, 0.7);
    this.stroke = new VariableProperty('Outline and Fill', 'Color', 'Outline', [
      'Outline',
      'Fill + Outline',
    ]);

    this.waveType = new VariableProperty('Wave Type', 'Base', 'sin', ['sin', 'cos', 'tan']);
    this.shape = new VariableProperty('Shape', 'Base', 'torus', [
      'torus',
      'plane',
      'box',
      'sphere',
      'glock',
      'ellipsoid',
      'cylinder',
      'cone',
      'lambo',
      'shuttle',
      'ducky',
      'whale',
      'dolphin',
      'satellite',
      'sword',
    ]);

    this.yPoints = new Array(Math.floor(this.waveWidth / this.xSpacing.currentValue));
  }
}

/**
 * Based on the current wave period and spacing between x points
 * get the location of the y points to be rendered in the wave
 */
WEBGLWave.prototype.calcWave = function(p5) {
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
WEBGLWave.prototype.render = function(p5) {
  'use strict';

  if (this.xSpacing.currentValue <= 0) {
    this.xSpacing.currentValue = this.xSpacing.min / 2;
  }

  if (this.elemQty.currentValue < this.elemQty.defaultMin) {
    this.elemQty.currentValue = this.elemQty.defaultMin;
  }
  this.yPoints = new Array(Math.floor(this.waveWidth / this.elemQty.currentValue));
  let waveWidth = this.xSpacing.currentValue * Math.round(this.elemQty.currentValue - 1);

  this.calcWave(p5);
  this.rotateWave(p5);

  p5.translate(
    this.translateX.currentValue,
    this.translateY.currentValue,
    this.translateZ.currentValue,
  );

  const loadedModels = [
    'lambo',
    'glock',
    'shuttle',
    'shuttle',
    'ducky',
    'whale',
    'dolphin',
    'satellite',
    'sword',
  ];

  if (!loadedModels.includes(this.shape.currentValue)) {
    this.setColor(p5);
  }

  for (let x = 0; x < this.elemQty.currentValue; x++) {
    let xPos = -(waveWidth / 2) + x * this.xSpacing.currentValue;
    let yPos = p5.height / 2 + this.yPoints[x] - this.windowHeight / 2;
    let zPos = 0;

    p5.push();
    p5.translate(xPos, yPos, zPos);
    this.renderShape(p5);
    p5.pop();
  }
};

/**
 * Sets the rotational speed along the X, Y, and Z axis of the individual wave.
 */
WEBGLWave.prototype.rotateWave = function(p5) {
  p5.rotateX(p5.frameCount * 0.01 * this.waveRotateX.currentValue);
  p5.rotateY(p5.frameCount * 0.01 * this.waveRotateY.currentValue);
  p5.rotateZ(p5.frameCount * 0.01 * this.waveRotateZ.currentValue);
};

/**
 * Sets the rotational speed along the X, Y, and Z axis of each shape
 */
WEBGLWave.prototype.rotateShape = function(p5) {
  p5.rotateX(p5.frameCount * 0.01 * this.rotateX.currentValue);
  p5.rotateY(p5.frameCount * 0.01 * this.rotateY.currentValue);
  p5.rotateZ(p5.frameCount * 0.01 * this.rotateZ.currentValue);
};

/**
 * Based on user toggling, set the color profile for element to be rendered
 */
WEBGLWave.prototype.setColor = function(p5) {
  switch (this.stroke.currentValue) {
    case 'Outline':
      p5.strokeWeight(1);
      p5.stroke(this.strokeHue.currentValue, this.saturation.currentValue, 100);
      p5.noFill();
      break;
    case 'Fill + Outline':
      p5.strokeWeight(1);
      p5.stroke(this.strokeHue.currentValue, this.saturation.currentValue, 100);
      p5.fill(this.fillHue.currentValue, this.saturation.currentValue, 100);
      break;
  }
};

/**
 * Renders the given 3D Primitive Shape
 */
WEBGLWave.prototype.renderShape = function(p5) {
  p5.push();

  this.rotateShape(p5);

  switch (this.shape.currentValue) {
    case 'box':
    case 'sphere':
      p5[this.shape.currentValue](this.radius.currentValue * 3);
      break;
    case 'plane':
    case 'torus':
      p5[this.shape.currentValue](this.radius.currentValue * 3.5, this.radius.currentValue * 1.5);
      break;
    case 'cylinder':
      p5[this.shape.currentValue](this.radius.currentValue * 4, this.radius.currentValue * 5);
      break;
    case 'cone':
      p5[this.shape.currentValue](this.radius.currentValue * 5, this.radius.currentValue * 20);
      break;
    case 'ellipsoid':
      p5[this.shape.currentValue](
        this.radius.currentValue * 5,
        this.radius.currentValue * 2,
        this.radius.currentValue,
      );
      break;
    case 'lambo':
    case 'glock':
    case 'shuttle':
    case 'ducky':
    case 'whale':
    case 'dolphin':
    case 'satellite':
    case 'sword':
      p5.normalMaterial();

      p5.scale(this.radius.currentValue * 0.07);
      p5.model(p5.objects[this.shape.currentValue]);
      break;
  }
  p5.pop();
};

WEBGLWave.prototype.easeInto = easeInto;

export default WEBGLWave;
