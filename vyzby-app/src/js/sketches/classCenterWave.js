
import easeInto from '@/js/services/easingService';

class CenterWave {
  constructor(windowWidth, windowHeight, p5) {

    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.waveWidth = windowWidth + 200;  // have some of it go off the page
    this.origin = 0;
    this.bypass = false;

    // this.shake = {
    //   attrType : 'boolean',
    //   on : false,
    //   hasParameters : true,
    //   displayLabel : 'Shake',
    //   resetValue : 20,
    //   defaultValue : 20,
    //   currentValue : 20,
    //   targetValue : null,
    //   min : -50,    // this can be edited by the user
    //   defaultMin : 0,   //  this is the range within which the user can edit the min and max values
    //   max : 1500,    // this can be edited by the user
    //   defaultMax : 2000,   //  this is the range within which the user can edit the min and max values
    //   triggerSource : null,
    //   lockOn : false,
    //   easingValue : 0.7,
    //   noteHeldEasing: 0.1,
    //   easingMax : 0,
    //   easingMin : 0,
    // };

    // this.shake = true;
    // this.shakeGain = 0.009;  // should be make this a dial/ controllable by button

    //  Numeric Type Attributes
    this.radius = {
      displayLabel : 'Size',
      resetValue : 20,
      defaultValue : 20,
      currentValue : 20,
      targetValue : null,
      min : -50,    // this can be edited by the user
      defaultMin : 0,   //  this is the range within which the user can edit the min and max values
      max : 1500,    // this can be edited by the user
      defaultMax : 2000,   //  this is the range within which the user can edit the min and max values
      attrType : 'numeric',
      audio : {
        responsiveType : 'add',
        responsiveOptions : ['add', 'subtract'],
        gain : 0.5,
        fall : 1, // not sure what this will do yet
      },
      triggerSource : null,
      lockOn : false,
      easingValue : 0.7,
      noteHeldEasing: 0.1,
      easingMax : 0,
      easingMin : 0,
    };

    this.velocity = {
      displayLabel : 'Velocity',
      resetValue : 0.025,
      defaultValue : 0.025,
      currentValue : 0.025,
      targetValue : null,
      min : -1,   // this can be edited by the user
      defaultMin : -1,    //  this is the range within which the user can edit the min and max values
      max : 1,    // this can be edited by the user
      defaultMax : 1,   //  this is the range within which the user can edit the min and max values
      attrType : 'numeric',
      audio : {
        responsiveType : 'add',
        responsiveOptions : ['add', 'subtract'],
        gain : 0.5,
        fall : 1, // not sure what this will do yet
      },
      triggerSource : null,
      lockOn : false,
      easingValue : 0.1,
      noteHeldEasing : 0.1,
      easingMax : 0,
      easingMin : 0,
    };

    this.amplitude = {
      displayLabel : 'Amplitude',
      resetValue : 75,
      defaultValue : 75,
      currentValue : 75,
      targetValue : null,
      min : -2000,    // this can be edited by the user
      defaultMin : -2000,   //  this is the range within which the user can edit the min and max values
      max : 2000,   // this can be edited by the user
      defaultMax : 2000,    //  this is the range within which the user can edit the min and max values
      attrType : 'numeric',
      audio : {
        responsiveType : 'add',
        responsiveOptions : ['add', 'subtract'],
        gain : 0.5,
        fall : 1, // not sure what this will do yet
      },
      triggerSource : null,
      lockOn : false,
      easingValue : 0.1,
      noteHeldEasing : 0.1,
      easingMax : 0,
      easingMin : 0,
    };

    this.period = {
      displayLabel : 'Period',
      resetValue : 500,
      defaultValue : 500,
      currentValue : 500,
      targetValue : null,
      min : -10250,   // this can be edited by the user
      defaultMin : -10250,    //  this is the range within which the user can edit the min and max values
      max : 10250,    // this can be edited by the user
      defaultMax : 10250,   //  this is the range within which the user can edit the min and max values
      attrType : 'numeric',
      audio : {
        responsiveType : 'add',
        responsiveOptions : ['add', 'subtract'],
        gain : 0.5,
        fall : 1, // not sure what this will do yet
      },
      triggerSource : null,
      lockOn : false,
      easingValue : 0.07,
      noteHeldEasing: 0.07,
      easingMax : 0,
      easingMin : 0,
    };

    this.xSpacing = {
      displayLabel : 'X Spacing',
      resetValue : 40,
      defaultValue : 40,
      currentValue : 40,
      targetValue : null,
      min : 15,   // this can be edited by the user
      defaultMin : 15,    //  this is the range within which the user can edit the min and max values
      max : 350,    // this can be edited by the user
      defaultMax : 350,   //  this is the range within which the user can edit the min and max values
      attrType : 'numeric',
      audio : {
        responsiveType : 'add',
        responsiveOptions : ['add', 'subtract'],
        gain : .6,
        fall : 1, // not sure what this will do yet
      },
      triggerSource : null,
      lockOn : false,
      easingValue : 0.1,
      noteHeldEasing : 0.1,
      easingMax : 0,
      easingMin : 0,
    };

    this.hue = {
      displayLabel : 'Color',
      resetValue : 100,
      defaultValue : 100,
      currentValue : 200,
      targetValue : null,
      min : 0,    // this can be edited by the user
      defaultMin : 0,   //  this is the range within which the user can edit the min and max values
      max : 360,    // this can be edited by the user
      defaultMax : 360,   //  this is the range within which the user can edit the min and max values
      attrType : 'numeric',
      audio : {
        responsiveType : 'add',
        responsiveOptions : ['add', 'subtract'],
        gain : 0.5,
        fall : 1, // not sure what this will do yet
      },
      triggerSource : null,
      lockOn : false,
      easingValue : 0.1,
      noteHeldEasing : 0.1,
      easingMax : 0,
      easingMin : 0,
    };

    this.saturation = {
      displayLabel : 'Saturation',
      resetValue : 100,
      defaultValue : 100,
      currentValue : 100,
      targetValue : null,
      min : 0,    // this can be edited by the user
      defaultMin : 0,   //  this is the range within which the user can edit the min and max values
      max : 100,    // this can be edited by the user
      defaultMax : 100,   //  this is the range within which the user can edit the min and max values
      attrType : 'numeric',
      audio : {
        responsiveType : 'add',
        responsiveOptions : ['add', 'subtract'],
        gain : 0.5,
        fall : 1, // not sure what this will do yet
      },
      triggerSource : null,
      lockOn : false,
      easingValue : 0.1,
      noteHeldEasing : 0.1,
      easingMax : 0,
      easingMin : 0,
    };

    //  Variable Type Attributes
    this.waveType = {
      displayLabel : 'Wave Type',
      resetValue : 'sin',
      defaultValue : 'sin',
      currentValue : 'sin',
      targetValue : null,
      options : ['sin', 'cos', 'tan'],
      attrType : 'variable',
      lockOn : false,

    };

    this.shape = {
      displayLabel : 'Shape',
      resetValue : 'ellipse',
      defaultValue : 'ellipse',
      currentValue : 'ellipse',
      targetValue : null,
      options : ['line', 'triangle', 'square', 'pentagon', 'ellipse'],
      attrType : 'variable',
      lockOn : false,

    };
    this.stroke = {
      displayLabel : 'Outline and Fill',
      resetValue : 'Outline',
      defaultValue : 'Outline',
      currentValue : 'Outline',
      targetValue : null,
      attrType : 'variable',
      options : ['Outline', 'Filled'],
      lockOn : false,
    };


    this.yPoints = new Array(Math.floor(this.waveWidth / this.xSpacing.currentValue));

  }
}


// METHODS


/**
 * Based on the current wave period and spacing between x points
 * get the location of the y points to be rendered in the wave
 */
CenterWave.prototype.calcWave = function (p5) {
  "use strict";

  let dx = (p5.TWO_PI / this.period.currentValue ) * this.xSpacing.currentValue;
  this.waveType.currentValue = (this.waveType.options.includes(this.waveType.currentValue)) ? this.waveType.currentValue : 'sin';
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

let slider =
  CenterWave.prototype.render = function(p5) {
  "use strict";

  if (this.xSpacing.currentValue <= 0) {
    this.xSpacing.currentValue = this.xSpacing.min / 2;
  }
  this.yPoints = new Array(Math.floor(this.waveWidth / this.xSpacing.currentValue));
  this.calcWave(p5);

    p5.push();
    this.setColor(p5);
    for (let x = 0; x < this.yPoints.length; x++) {
      let xPos = x * this.xSpacing.currentValue - this.windowWidth/2;
      let yPos = p5.height/2 + this.yPoints[x] - this.windowHeight/2;

      if (this.shake === true) {
        xPos +=  p5.noise(xPos) / this.noiseGain;
        yPos +=  p5.noise(yPos) / this.noiseGain;
      }

      this.renderShape(p5, xPos, yPos, this.radius.currentValue);
    }
    p5.pop();
  };



/**
 * Renders a given shape along the the passed x and y positions.
 * @param xPos
 * @param yPos
 * @param radius
 */
CenterWave.prototype.renderShape = function(p5, xPos, yPos, radius) {
  "use strict";

  let polygons = ['line', 'triangle', 'square', 'pentagon'];  // polygons we are allowing for set in the shape attribute

  if (this.shape.currentValue === 'ellipse') {
    p5.ellipse(xPos, yPos, radius, radius);
  } else if (polygons.includes(this.shape.currentValue)) {
    let sides;

    p5.push();
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
    p5.polygon(0, 0, radius, sides);
    p5.pop();
  } else {
    p5.ellipse(xPos, yPos, radius, radius);
  }
};


/**
 * Based on user toggling, set the color profile for element to be rendered
 */
CenterWave.prototype.setColor = function(p5) {
  "use strict";
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



