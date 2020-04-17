import easeInto from '@/js/services/EasingService';
import helper from '@/js/services/p5Helper.js';
import Utils from '@/js/services/Utils';
import NumericProperty from '@/js/services/PropertyConstructorNumeric';
import VariableProperty from '@/js/services/PropertyConstructorVariable';
import CatalogueDataEntry from '@/js/services/CatalogueDataEntry';

import SketchCatalogue from '@/js/services/SketchCatalogue';

class Parametric {
  constructor(windowWidth, windowHeight, p5) {
    this.sid = Utils.guidGenerator();

    this.catalogueInfo = new CatalogueDataEntry(
      this.constructor,
      'Parametric Shapes',
      'A collecetion of simple parametric shapes.',
      ['Parametric'],
      'clyzby',
      './assets/sketch_catalogue_gifs/parametric-1_200.gif',
      300,
      2,
    );

    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.origin = 0;
    this.bypass = false;

    this.x = 0;
    this.y = 0;

    this.width = new NumericProperty('Width', 'Base', 400, 50, 1000, 0.7);
    this.height = new NumericProperty('Height', 'Base', 400, 50, 1000, 0.7);
    this.iter = new NumericProperty('Iteration', 'Base', 200, 3, 300, 0.7);
    this.deltaTheta = new NumericProperty('Delta Theta', 'Base', 1, 0, 8, 0.7);
    this.q = new NumericProperty('Q', 'Base', 1, -5, 5, 0.7);

    this.hue = new NumericProperty('Color', 'Color', 200, 0, 360, 0.7);
    this.saturation = new NumericProperty('Saturation', 'Color', 100, 0, 100, 0.7);

    this.translateX = new NumericProperty(
      'Translate X',
      'Position',
      2,
      -windowWidth * 0.5,
      windowWidth * 0.5,
      0.7,
    );
    this.translateY = new NumericProperty(
      'Translate Y',
      'Position',
      2,
      -windowHeight * 0.5,
      windowHeight * 0.5,
      0.7,
    );
    this.translateZ = new NumericProperty('Translate Z', 'Position', 0, -1000, 1000, 0.7);

    this.velocity = new NumericProperty('Velocity', 'Base', 0, -0.5, 0.5, 0.7);

    this.rotateX = new NumericProperty('Rotate Shape X', 'Rotation', 0, -10, 10, 0.7);
    this.rotateXVelocity = new NumericProperty(
      'Rotate Shape X Velocity',
      'Rotation',
      0,
      -10,
      10,
      0.7,
    );
    this.rotateY = new NumericProperty('Rotate Shape Y', 'Rotation', 0, -10, 10, 0.7);
    this.rotateYVelocity = new NumericProperty(
      'Rotate Shape Y Velocity',
      'Rotation',
      0,
      -10,
      10,
      0.7,
    );
    this.rotateZ = new NumericProperty('Rotate Shape Z', 'Rotation', 0, -10, 10, 0.7);
    this.rotateZVelocity = new NumericProperty(
      'Rotate Shape Z Velocity',
      'Rotation',
      0,
      -10,
      10,
      0.7,
    );

    this.equationType = new VariableProperty('Shape Type', 'Base', 'Ring', ['Ring', 'Pipe', 'Triangle']);
  }
}

const shape = {
  k: 0,
  q: 1,
  theta: 1,
};

Parametric.prototype.render = function(p5) {
  p5.noFill();
  p5.stroke(this.hue.currentValue, this.saturation.currentValue, 100);
  p5.strokeWeight(1);
  p5.translate(
    this.translateX.currentValue,
    this.translateY.currentValue,
    this.translateZ.currentValue,
  );
  this.rotateShape(p5);

  shape.q = this.q.currentValue + p5.frameCount * this.velocity.currentValue;

  p5.beginShape();
  for (let i = 0; i < this.iter.currentValue; i++) {
    shape.theta += this.deltaTheta.currentValue;

    const position = this.getEquation()(p5);
    const x = position.x * this.width.currentValue;
    const y = position.y * this.height.currentValue;

    p5.curveVertex(x, y);
  }
  p5.endShape();
};

Parametric.prototype.getEquation = function() {
  switch (this.equationType.currentValue) {
    case 'Ring':
      return this.parametricRing;
    case 'Pipe':
      return this.parametricPipe;
    case 'Triangle':
      return this.parametric006;
    default:
      return this.parametricRing;
  }
};

Parametric.prototype.rotateShape = function(p5) {
  p5.rotateX(
    p5.frameCount * (this.rotateXVelocity ? this.rotateXVelocity.currentValue : 0) +
      this.rotateX.currentValue,
  );
  p5.rotateY(
    p5.frameCount * (this.rotateYVelocity ? this.rotateYVelocity.currentValue : 0) +
      this.rotateY.currentValue,
  );
  p5.rotateZ(
    p5.frameCount * (this.rotateZVelocity ? this.rotateZVelocity.currentValue : 0) +
      this.rotateZ.currentValue,
  );
};

Parametric.prototype.parametricRing = function(p5) {
  return {
    x: p5.sin(shape.q * shape.theta),
    y: p5.cos(shape.q * shape.theta),
  };
};

Parametric.prototype.parametricPipe = function(p5) {
  return {
    x: p5.sin(shape.q * shape.theta),
    y: p5.tan(shape.q * shape.theta),
  };
};

Parametric.prototype.parametricTest = function(p5) {
  // todo control the xy growth of the shape
  let bounce = {
    max: 7,
    min: 6,
    rate: '?todo',
  };
  this.width = p5.sin(p5.map(this.q, 0, 0.51, bounce.min, bounce.max));
  this.height = p5.sin(p5.map(this.q, 0, 0.51, bounce.min, bounce.max));

  return {
    x:
      (cos(this.q + sin(this.theta)) * this.windowWidth) / this.width +
      windowWidth / 2 +
      this.translateX,
    y: (cos(this.theta) * windowHeight) / this.height + windowHeight / 2 + this.translateY,
  };
};

// Parametric.prototype.parametricFullScreenStrobeRing = function(p5) {
//   // todo control the xy growth of the shape
//   let bounce = {
//     max: 7,
//     min: 6,
//     rate: '?todo',
//   };

//   this.width += p5.sin(p5.map(shape.q, 0, 0.51, bounce.min, bounce.max));
//   this.height += p5.sin(p5.map(shape.q, 0, 0.51, bounce.min, bounce.max));

//   // console.log(sin(this.q));

//   return {
//     x:
//       p5.cos(shape.q + p5.sin(shape.theta)),
//     y: p5.cos(shape.theta) * this.windowHeight,
//   };
// }

Parametric.prototype.parametricFullScreenBounce = function(p5) {
  // todo control the xy growth of the shape
  let bounce = {
    max: 7,
    min: 6,
    rate: '?todo',
  };
  this.width = p5.sin(map(this.q, 0, 0.51, bounce.min, bounce.max));

  // console.log(sin(this.q));

  return {
    x:
      (p5.cos(this.q + p5.sin(this.theta)) * this.windowWidth) / this.width +
      this.windowWidth / 2 +
      this.translateX,
    y: (p5.cos(this.theta) * windowHeight) / this.height + this.windowHeight / 2 + this.translateY,
  };
};

Parametric.prototype.parametricSizeBounceTest = function(p5) {
  // todo control the xy growth of the shape
  let bounce = {
    max: 7,
    min: 2,
    rate: '?todo',
  };
  this.width = p5.map(this.rate, -0.5, 0.51, bounce.min, bounce.max);

  // console.log(p5.sin(this.q));

  return {
    x:
      (p5.sin(this.theta + p5.cos(4 * this.theta + this.q)) * windowWidth) / this.width +
      windowWidth / 2 +
      this.translateX,
    y: (p5.cos(this.theta) * windowHeight) / this.height + windowHeight / 2 + this.translateY,
  };
};

Parametric.prototype.parametricFullScreenPattern002 = function(p5) {
  //todo sharpen sensitivity rate
  const m = p5.map(p5.sin(this.q.currentValue), 0.000001, 1000, 10, 500);

  return {
    x:
      (p5.sin(shape.theta + p5.cos(4 * shape.theta + shape.q)) * this.windowWidth) /
      (p5.sin(m) / 2),
    y: p5.cos(this.theta) * this.windowHeight,
  };
};

Parametric.prototype.parametricFullScreenPattern001 = function(p5) {
  let m = p5.map(p5.sin(this.theta), 0.000001, 1000, 10, 500);

  return {
    x:
      (p5.sin(this.theta + p5.cos(4 * this.theta + this.q)) * windowWidth) / (p5.sin(m) / 2) +
      windowWidth / 2 +
      this.translateX,
    y: (p5.cos(this.theta) * windowHeight) / this.height + windowHeight / 2 + this.translateY,
  };
};

Parametric.prototype.parametricVerticalNoise = function(p5) {
  let m = p5.map(p5.sin(this.theta + 2 * this.theta), 0.000001, 5, 0.01, 0.02);

  return {
    x:
      (p5.sin(this.theta + p5.cos(4 * this.theta + this.q)) * this.windowWidth) / m +
      this.windowWidth / 2 +
      this.translateX,
    y: (p5.cos(this.theta) * windowHeight) / this.height + this.windowHeight / 2 + this.translateY,
  };
};

Parametric.prototype.parametric010 = function(p5) {
  return {
    x:
      (p5.cos(this.q + p5.sin(this.theta + 2 * this.theta)) * this.windowWidth) / 3 +
      this.windowWidth / 2 +
      this.translateX,
    y:
      (p5.cos(this.theta + 2 * this.q) * this.windowHeight) / this.height +
      this.windowHeight / 2 +
      this.translateY,
  };
};

Parametric.prototype.parametricTeardrop = function(p5) {
  return {
    x:
      (p5.cos(this.q + p5.sin(this.theta)) * this.windowWidth) / 3 +
      this.windowWidth / 2 +
      this.translateX,
    y:
      (p5.cos(this.theta + this.q) * windowHeight) / this.height +
      this.windowHeight / 2 +
      this.translateY,
  };
};

Parametric.prototype.parametric006 = function(p5) {
  return {
    x: p5.sin(shape.theta + p5.sin(shape.theta + shape.q)),
    y: p5.cos(shape.theta + p5.sin(shape.theta - shape.q)),
  };
};
Parametric.prototype.parametric009 = function(p5) {
  return {
    x:
      (p5.sin(this.theta + p5.cos(4 * this.theta + this.q)) * this.windowWidth) / this.width +
      this.windowWidth / 2 +
      this.translateX,
    y:
      (p5.cos(this.theta) * this.windowHeight) / this.height +
      this.windowHeight / 2 +
      this.translateY,
  };
};

Parametric.prototype.parametric008 = function(p5) {
  return {
    x:
      (p5.sin(this.theta + p5.cos(4 * this.theta + this.q)) * this.windowWidth) / this.width +
      this.windowWidth / 2 +
      this.translateX,
    y:
      (p5.cos(this.theta) * this.windowHeight) / this.height +
      this.windowHeight / 2 +
      this.translateY,
  };
};

Parametric.prototype.parametric007 = function(p5) {
  return {
    x:
      (p5.sin(this.theta + p5.sin(4 * this.theta + this.q)) * this.windowWidth) / 4 +
      windowWidth / 2 +
      this.translateX,
    y:
      (p5.cos(this.theta + p5.sin(4 * this.theta + this.q)) * this.windowHeight) / this.height +
      this.windowHeight / 2 +
      this.translateY,
  };
};

Parametric.prototype.easeInto = easeInto;
export default Parametric;
