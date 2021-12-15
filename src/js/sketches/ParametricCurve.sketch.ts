import p5 from 'p5';
import NumericProperty from '@/js/services/PropertyConstructorNumeric';
import VariableProperty from '@/js/services/PropertyConstructorVariable';
import CatalogueDataEntry from '@/js/services/CatalogueDataEntry';
import { P5Base } from '../interfaces/P5Sketch.interface';

const shape = {
  k: 0,
  q: 1,
  theta: 1,
};

const velocityShapeMap = {
  ring: 0.0001,
  pipe: 0.0001,
  triangle: 1,
};

export default class Parametric extends P5Base {
  constructor() {
    super();
  }

  public catalogueInfo = new CatalogueDataEntry(
    this,
    'Parametric Shapes',
    'A collecetion of simple parametric shapes.',
    ['Parametric'],
    'clyzby',
    'parametric-1_200.gif',
    300,
    2,
    '2020-06-11',
  );

  public width = new NumericProperty('Width', 'Base', 400, 50, 1000, 0.7);
  public height = new NumericProperty('Height', 'Base', 400, 50, 1000, 0.7);
  public iter = new NumericProperty('Iteration', 'Base', 200, 3, 300, 0.7);
  public deltaTheta = new NumericProperty('Delta Theta', 'Base', 1, 0, 8, 0.7);
  public q = new NumericProperty('Q', 'Base', 1, -5, 5, 0.7);

  public hue = new NumericProperty('Color', 'Color', 200, 0, 360, 0.7);
  public saturation = new NumericProperty('Saturation', 'Color', 100, 0, 100, 0.7);

  public translateX = new NumericProperty(
    'Translate X',
    'Position',
    2,
    -this.windowWidth * 0.5,
    this.windowWidth * 0.5,
    0.7,
  );
  public translateY = new NumericProperty(
    'Translate Y',
    'Position',
    2,
    -this.windowHeight * 0.5,
    this.windowHeight * 0.5,
    0.7,
  );
  public translateZ = new NumericProperty('Translate Z', 'Position', 0, -1000, 1000, 0.7);

  public velocity = new NumericProperty('Velocity', 'Base', 0, -1, 1, 0.7, 0.1);

  public rotateX = new NumericProperty('Rotate Shape X', 'Rotation', 0, -10, 10, 0.7);
  public rotateXVelocity = new NumericProperty(
    'Rotate Shape X Velocity',
    'Rotation',
    0,
    -10,
    10,
    0.7,
  );
  public rotateY = new NumericProperty('Rotate Shape Y', 'Rotation', 0, -10, 10, 0.7);
  public rotateYVelocity = new NumericProperty(
    'Rotate Shape Y Velocity',
    'Rotation',
    0,
    -10,
    10,
    0.7,
  );
  public rotateZ = new NumericProperty('Rotate Shape Z', 'Rotation', 0, -10, 10, 0.7);
  public rotateZVelocity = new NumericProperty(
    'Rotate Shape Z Velocity',
    'Rotation',
    0,
    -10,
    10,
    0.7,
  );

  public shape = new VariableProperty('Shape Type', 'Base', 'ring', ['ring', 'pipe', 'triangle']);

  /**
   * Rendering Methods
   */
  private rotateShape = (sketch: p5) => {
    const { frameCount } = sketch;
    const xAngle =
      frameCount * (this.rotateXVelocity ? this.rotateXVelocity.currentValue : 0) +
      this.rotateX.currentValue;
    const yAngle =
      frameCount * (this.rotateYVelocity ? this.rotateYVelocity.currentValue : 0) +
      this.rotateY.currentValue;
    const zAngle =
      sketch.frameCount * (this.rotateZVelocity ? this.rotateZVelocity.currentValue : 0) +
      this.rotateZ.currentValue;

    sketch.rotateX(xAngle);
    sketch.rotateY(yAngle);
    sketch.rotateZ(zAngle);
  };

  private getShapeEquation = (shape: string): Function => {
    const equationToShapeMap = {
      ring: this.parametricRing,
      pipe: this.parametricPipe,
      triangle: this.parametric006,
    };

    return equationToShapeMap[shape] || this.parametricRing;
  };

  private parametricRing = () => {
    return {
      x: Math.sin(shape.q * shape.theta),
      y: Math.cos(shape.q * shape.theta),
    };
  };

  private parametricPipe = () => {
    return {
      x: Math.sin(shape.q * shape.theta),
      y: Math.tan(shape.q * shape.theta),
    };
  };

  private parametric006 = () => {
    const { q, theta } = shape;

    return {
      x: Math.sin(theta + Math.sin(theta + q)),
      y: Math.cos(theta + Math.sin(theta - q)),
    };
  };

  // private parametricFullScreenBounce = (sketch: p5) => {
  //   // todo control the xy growth of the shape
  //   const bounce = {
  //     max: 7,
  //     min: 6,
  //     rate: '?todo',
  //   };
  //   const { q, theta } = shape;
  //   const width = Math.sin(sketch.map(q, 0, 0.51, bounce.min, bounce.max));

  //   return {
  //     x:
  //       (Math.cos(q + Math.sin(theta)) * this.windowWidth) / width +
  //       this.windowWidth / 2 +
  //       this.translateX.currentValue,
  //     y:
  //       (Math.cos(theta) * this.windowHeight) / this.height.currentValue +
  //       this.windowHeight / 2 +
  //       this.translateY.currentValue,
  //   };
  // };

  /**
   * Primary Render Method
   */
  public render = (sketch: p5) => {
    sketch.noFill();
    sketch.stroke(this.hue.currentValue, this.saturation.currentValue, 100);
    sketch.strokeWeight(1);
    sketch.translate(
      this.translateX.currentValue,
      this.translateY.currentValue,
      this.translateZ.currentValue,
    );
    this.rotateShape(sketch);
    // const velMapAmount = -(1000 ** 1000);
    const shapeType = this.shape.currentValue;
    const mappedVelocity = this.velocity.currentValue * (velocityShapeMap[shapeType] || 1);
    shape.q = this.q.currentValue + sketch.frameCount * mappedVelocity;

    sketch.beginShape();
    for (let i = 0; i < this.iter.currentValue; i++) {
      shape.theta += this.deltaTheta.currentValue;

      const position = this.getShapeEquation(shapeType)();
      const x = position.x * this.width.currentValue;
      const y = position.y * this.height.currentValue;

      sketch.curveVertex(x, y);
    }
    sketch.endShape();
  };
}

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

/**
 * TODO - Reimplement these in es6
 */

// Parametric.prototype.parametricSizeBounceTest = function(p5) {
//   // todo control the xy growth of the shape
//   let bounce = {
//     max: 7,
//     min: 2,
//     rate: '?todo',
//   };
//   this.width = p5.map(this.rate, -0.5, 0.51, bounce.min, bounce.max);

//   // console.log(p5.sin(this.q));

//   return {
//     x:
//       (p5.sin(this.theta + p5.cos(4 * this.theta + this.q)) * windowWidth) / this.width +
//       windowWidth / 2 +
//       this.translateX,
//     y: (p5.cos(this.theta) * windowHeight) / this.height + windowHeight / 2 + this.translateY,
//   };
// };

// Parametric.prototype.parametricFullScreenPattern002 = function(p5) {
//   //todo sharpen sensitivity rate
//   const m = p5.map(p5.sin(this.q.currentValue), 0.000001, 1000, 10, 500);

//   return {
//     x:
//       (p5.sin(shape.theta + p5.cos(4 * shape.theta + shape.q)) * this.windowWidth) /
//       (p5.sin(m) / 2),
//     y: p5.cos(this.theta) * this.windowHeight,
//   };
// };

// Parametric.prototype.parametricFullScreenPattern001 = function(p5) {
//   let m = p5.map(p5.sin(this.theta), 0.000001, 1000, 10, 500);

//   return {
//     x:
//       (p5.sin(this.theta + p5.cos(4 * this.theta + this.q)) * windowWidth) / (p5.sin(m) / 2) +
//       windowWidth / 2 +
//       this.translateX,
//     y: (p5.cos(this.theta) * windowHeight) / this.height + windowHeight / 2 + this.translateY,
//   };
// };

// Parametric.prototype.parametricVerticalNoise = function(p5) {
//   let m = p5.map(p5.sin(this.theta + 2 * this.theta), 0.000001, 5, 0.01, 0.02);

//   return {
//     x:
//       (p5.sin(this.theta + p5.cos(4 * this.theta + this.q)) * this.windowWidth) / m +
//       this.windowWidth / 2 +
//       this.translateX,
//     y: (p5.cos(this.theta) * windowHeight) / this.height + this.windowHeight / 2 + this.translateY,
//   };
// };

// Parametric.prototype.parametric010 = function(p5) {
//   return {
//     x:
//       (p5.cos(this.q + p5.sin(this.theta + 2 * this.theta)) * this.windowWidth) / 3 +
//       this.windowWidth / 2 +
//       this.translateX,
//     y:
//       (p5.cos(this.theta + 2 * this.q) * this.windowHeight) / this.height +
//       this.windowHeight / 2 +
//       this.translateY,
//   };
// };

// Parametric.prototype.parametricTeardrop = function(p5) {
//   return {
//     x:
//       (p5.cos(this.q + p5.sin(this.theta)) * this.windowWidth) / 3 +
//       this.windowWidth / 2 +
//       this.translateX,
//     y:
//       (p5.cos(this.theta + this.q) * windowHeight) / this.height +
//       this.windowHeight / 2 +
//       this.translateY,
//   };
// };

// Parametric.prototype.parametric009 = function(p5) {
//   return {
//     x:
//       (p5.sin(this.theta + p5.cos(4 * this.theta + this.q)) * this.windowWidth) / this.width +
//       this.windowWidth / 2 +
//       this.translateX,
//     y:
//       (p5.cos(this.theta) * this.windowHeight) / this.height +
//       this.windowHeight / 2 +
//       this.translateY,
//   };
// };

// Parametric.prototype.parametric008 = function(p5) {
//   return {
//     x:
//       (p5.sin(this.theta + p5.cos(4 * this.theta + this.q)) * this.windowWidth) / this.width +
//       this.windowWidth / 2 +
//       this.translateX,
//     y:
//       (p5.cos(this.theta) * this.windowHeight) / this.height +
//       this.windowHeight / 2 +
//       this.translateY,
//   };
// };

// Parametric.prototype.parametric007 = function(p5) {
//   return {
//     x:
//       (p5.sin(this.theta + p5.sin(4 * this.theta + this.q)) * this.windowWidth) / 4 +
//       windowWidth / 2 +
//       this.translateX,
//     y:
//       (p5.cos(this.theta + p5.sin(4 * this.theta + this.q)) * this.windowHeight) / this.height +
//       this.windowHeight / 2 +
//       this.translateY,
//   };
// };
