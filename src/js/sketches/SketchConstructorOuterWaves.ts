import helper from '@/js/services/p5Helper.js';
import NumericProperty from '@/js/services/PropertyConstructorNumeric';
import VariableProperty from '@/js/services/PropertyConstructorVariable';
import CatalogueDataEntry from '@/js/services/CatalogueDataEntry';
import { P5Base, P5Sketch } from '../interfaces/P5Sketch.interface';
import p5 from 'p5';

let origin = 0;
let yPoints = [];

export default class OuterWaves extends P5Base implements P5Sketch {
  constructor() {
    super();
  }

  public catalogueInfo = new CatalogueDataEntry(
    this,
    'Sine Wave Set',
    'A group of parametric sine waves with various shapes as point along the wave.',
    ['Parametric'],
    'clyzby',
    'outer-waves_200.gif',
    202,
    4,
    '2019-02-11',
  );

  public waveWidth = window.innerWidth + 200; // have some of it go off the page
  public origin = 0;

  public numWaves = new NumericProperty('Number of Waves', 'Base', 1, 0, 9, 0.5);
  public radius = new NumericProperty('Size', 'Base', 10, 0, 200, 0.5);
  public velocity = new NumericProperty('Velocity', 'Base', 0.025, -0.5, 0.6, 0.1);
  public amplitude = new NumericProperty('Amplitude', 'Base', 75, -400, 500, 0.1);
  public period = new NumericProperty('Period', 'Base', 1000, 0, 2250, 0.07);
  public xSpacing = new NumericProperty('X Spacing', 'Base', 40, 15, 350, 0.1);
  public ySpacing = new NumericProperty('Y Spacing', 'Base', 40, 5, 350, 0.1);
  public waveType = new VariableProperty('Wave Type', 'Base', 'sin', ['sin', 'cos', 'tan']);
  public shape = new VariableProperty('Shape', 'Base', 'ellipse', [
    'line',
    'triangle',
    'square',
    'pentagon',
    'ellipse',
  ]);

  public waveRotateX = new NumericProperty('Rotate Wave X', 'Rotation', 0, -10, 10, 0.7);
  public waveRotateXVelocity = new NumericProperty(
    'Rotate Wave X Velocity',
    'Rotation',
    0,
    -0.2,
    0.2,
    0.7,
  );
  public waveRotateY = new NumericProperty('Rotate Wave Y', 'Rotation', 0, -10, 10, 0.7);
  public waveRotateYVelocity = new NumericProperty(
    'Rotate Wave Y Velocity',
    'Rotation',
    0,
    -0.2,
    0.2,
    0.7,
  );
  public waveRotateZ = new NumericProperty('Rotate Wave Z', 'Rotation', 0, -10, 10, 0.7);
  public waveRotateZVelocity = new NumericProperty(
    'Rotate Wave Z Velocity',
    'Rotation',
    0,
    -0.2,
    0.2,
    0.7,
  );

  public hue = new NumericProperty('Color', 'Color', 200, 0, 360, 0.1);
  public saturation = new NumericProperty('Saturation', 'Color', 100, 0, 100, 0.1);
  public stroke = new VariableProperty('Outline and Fill', 'Color', 'Outline', [
    'Outline',
    'Filled',
  ]);

  private rotateShape = helper.rotateShape;
  private setColor = helper.setColor;
  private renderShape = helper.renderShape;

  private calcWave = (p5: p5) => {
    yPoints = new Array(Math.ceil(this.waveWidth / this.xSpacing.currentValue));

    const dx = (p5.TWO_PI / this.period.currentValue) * this.xSpacing.currentValue;
    this.waveType.currentValue = this.waveType.options.includes(this.waveType.currentValue)
      ? this.waveType.currentValue
      : 'sin';
    origin += this.velocity.currentValue;
    let x = origin;
    for (let i = 0; i < yPoints.length; i++) {
      yPoints[i] = Math[this.waveType.currentValue](x) * this.amplitude.currentValue;
      x += dx;
    }
  };

  private rotateWave = p5 => {
    p5.rotateX(
      p5.frameCount * this.waveRotateXVelocity.currentValue + this.waveRotateX.currentValue,
    );
    p5.rotateY(
      p5.frameCount * this.waveRotateYVelocity.currentValue + this.waveRotateY.currentValue,
    );
    p5.rotateZ(
      p5.frameCount * this.waveRotateZVelocity.currentValue + this.waveRotateZ.currentValue,
    );
  };

  public render = (p5: p5) => {
    if (this.xSpacing.currentValue <= 0) {
      this.xSpacing.currentValue = this.xSpacing.min / 2;
    }

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

      for (let x = 0; x < yPoints.length; x++) {
        let xPos = x * this.xSpacing.currentValue - p5.windowWidth / 2;
        let yPos = p5.height / 2 + yPoints[x] - p5.windowHeight / 2;

        this.renderShape(p5, xPos, yPos + s, r);
        this.renderShape(p5, xPos, yPos - s, r);
      }
    }
    p5.pop();
  };
}
