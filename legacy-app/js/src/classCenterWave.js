
class CenterWave {
  constructor(windowWidth, windowHeight) {
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.waveWidth = windowWidth + 200; // have some of it go off the page
    this.origin = 0;
    this.bypass = false;

    this.easeInto = easeInto;

    this.radius = new NumericProperty('Size', 'Base', 20, -50, 2000, 0.7);
    this.velocity = new NumericProperty('Velocity', 'Base', 0.025, -1, 1, 0.1);
    this.amplitude = new NumericProperty('Amplitude', 'Base', 75, -2000, 2000, 0.1);
    this.period = new NumericProperty('Period', 'Base', 500, -10250, 10250, 0.07);
    this.xSpacing = new NumericProperty('X Spacing', 'Base', 40, 15, 350, 0.1);

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

let centerWaveInstance = new CenterWave(window.innerWidth, window.innerHeight);
var registeredCtrlElements = registeredCtrlElements || [];
registeredCtrlElements.push(centerWaveInstance);

// METHODS

/**
 * Based on the current wave period and spacing between x points
 * get the location of the y points to be rendered in the wave
 */
CenterWave.prototype.calcWave = function() {
  'use strict';

  let dx = (myp5.TWO_PI / this.period.currentValue) * this.xSpacing.currentValue;
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

CenterWave.prototype.render = function() {
  'use strict';

  if (this.xSpacing.currentValue <= 0) {
    this.xSpacing.currentValue = this.xSpacing.min / 2;
  }
  this.yPoints = new Array(Math.floor(this.waveWidth / this.xSpacing.currentValue));
  this.calcWave();

  myp5.push();
  this.setColor();
  for (let x = 0; x < this.yPoints.length; x++) {
    let xPos = x * this.xSpacing.currentValue - this.windowWidth / 2;
    let yPos = myp5.height / 2 + this.yPoints[x] - this.windowHeight / 2;

    if (this.shake === true) {
      xPos += myp5.noise(xPos) / this.noiseGain;
      yPos += myp5.noise(yPos) / this.noiseGain;
    }

    this.renderShape(xPos, yPos, this.radius.currentValue);
  }
  myp5.pop();
};

/**
 * Renders a given shape along the the passed x and y positions.
 * @param xPos
 * @param yPos
 * @param radius
 */
CenterWave.prototype.renderShape = function(xPos, yPos, radius) {
  'use strict';

  let polygons = ['line', 'triangle', 'square', 'pentagon']; // polygons we are allowing for set in the shape attribute

  if (this.shape.currentValue === 'ellipse') {
    myp5.ellipse(xPos, yPos, radius, radius);
  } else if (polygons.includes(this.shape.currentValue)) {
    let sides;

    myp5.push();
    myp5.strokeWeight(1);

    switch (this.shape.currentValue) {
      case 'line':
        sides = 2;
        myp5.strokeWeight(2);

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

    myp5.translate(xPos, yPos);
    myp5.rotate(myp5.sin(myp5.frameCount / 50.0));
    myp5.polygon(0, 0, radius, sides);
    myp5.pop();
  } else {
    myp5.ellipse(xPos, yPos, radius, radius);
  }
};

/**
 * Based on user toggling, set the color profile for element to be rendered
 */
CenterWave.prototype.setColor = function() {
  'use strict';
  switch (this.stroke.currentValue) {
    case 'Outline':
      myp5.strokeWeight(1);
      myp5.stroke(this.hue.currentValue, this.saturation.currentValue, 100);
      myp5.noFill();
      break;
    case 'Filled':
      myp5.noStroke();
      myp5.fill(this.hue.currentValue, this.saturation.currentValue, 100);
      break;
  }
};

// CenterWave.prototype.easeInto = easeInto;
