import easeInto from '@/js/services/EasingService';
import helper from '@/js/services/p5Helper.js';
import { guidGenerator } from '../services/Utils';
import NumericProperty from '@/js/services/PropertyConstructorNumeric';
import VariableProperty from '@/js/services/PropertyConstructorVariable';
import CatalogueDataEntry from '@/js/services/CatalogueDataEntry';
import P5Sketch from '../interfaces/P5Sketch.interface';
import p5 from 'p5';

let origin = 0;
let yPoints: Array<number> = [];

export default class CenterWave implements P5Sketch {
  constructor (public windowWidth: number, public windowHeight: number) { }

  public sid = guidGenerator();

  public catalogueInfo = new CatalogueDataEntry(
    this.constructor,
    'Basic Sine Wave',
    'A simple parametric sine wave with various shapes as point along the wave.',
    [ 'Parametric', 'Awesome' ],
    'NOTNOTclyzby',
    './assets/sketch_catalogue_gifs/center-wave_200.gif',
    300,
    2,
    '2018-11-20',
  );
  public bypass = false;

  public waveWidth = window.innerWidth + 200; // have some of it go off the page
  public radius = new NumericProperty('Size', 'Base', 20, -1000, 2000, 0.7, 10);
  public velocity = new NumericProperty('Velocity', 'Base', 0.025, -1, 1.1, 0.1, 0.05,);
  public amplitude = new NumericProperty('Amplitude', 'Base', 75, -1500, 2000, 0.1, 10,);
  public period = new NumericProperty('Period', 'Base', 500, 0, 10250, 0.07, 10);
  public xSpacing = new NumericProperty('X Spacing', 'Base', 40, 1, 350, 0.7, 1);

  public waveRotateX = new NumericProperty('Rotate Wave X', 'Rotation', 0, -10, 10, 0.7, 1,);
  public waveRotateXVelocity = new NumericProperty('Rotate Wave X Velocity', 'Rotation', 0, -0.2, 0.2, 0.7, 0.05,);
  public waveRotateY = new NumericProperty('Rotate Wave Y', 'Rotation', 0, -10, 10, 0.7, 0.05);
  public waveRotateYVelocity = new NumericProperty('Rotate Wave Y Velocity', 'Rotation', 0, -0.2, 0.2, 0.7, 0.05);
  public waveRotateZ = new NumericProperty('Rotate Wave Z', 'Rotation', 0, -10, 10, 0.7, 0.1);
  public waveRotateZVelocity = new NumericProperty('Rotate Wave Z Velocity', 'Rotation', 0, -0.2, 0.2, 0.7, 0.05);

  public hue = new NumericProperty('Color', 'Color', 200, 0, 360, 0.1, 1);
  public saturation = new NumericProperty('Saturation', 'Color', 100, 0, 100, 0.1, 1);

  public waveType = new VariableProperty('Wave Type', 'Base', 'sin', [ 'sin', 'cos', 'tan' ]);
  public shape = new VariableProperty('Shape', 'Base', 'ellipse', [ 'line', 'triangle', 'square', 'pentagon', 'ellipse' ]);

  public stroke = new VariableProperty('Outline and Fill', 'Color', 'Outline', [ 'Outline', 'Filled', ]);

  private calcWave = (p5: p5) => {
    const dx =
      (p5.TWO_PI / this.period.currentValue) * this.xSpacing.currentValue;

    this.waveType.currentValue = this.waveType.options.includes(
      this.waveType.currentValue,
    )
      ? this.waveType.currentValue
      : 'sin';

    origin += this.velocity.currentValue;
    let x = origin;

    yPoints = new Array(
      Math.ceil(this.waveWidth / this.xSpacing.currentValue),
    );

    for (let i = 0; i < yPoints.length; i++) {
      yPoints[ i ] =
        Math[ this.waveType.currentValue ](x) * this.amplitude.currentValue;
      x += dx;
    }
  };

  private rotateWave = (p5: p5) => {
    p5.rotateX(
      p5.frameCount * this.waveRotateXVelocity.currentValue +
      this.waveRotateX.currentValue,
    );
    p5.rotateY(
      p5.frameCount * this.waveRotateYVelocity.currentValue +
      this.waveRotateY.currentValue,
    );
    p5.rotateZ(
      p5.frameCount * this.waveRotateZVelocity.currentValue +
      this.waveRotateZ.currentValue,
    );
  };

  private rotateShape = helper.rotateShape;
  private setColor = helper.setColor;
  private renderShape = helper.renderShape;
  public easeInto = easeInto;


  public render = (p5: p5) => {
    if (this.xSpacing.currentValue <= 0) {
      this.xSpacing.currentValue = this.xSpacing.min / 2;
    }
    yPoints = new Array(
      Math.ceil(this.waveWidth / this.xSpacing.currentValue),
    );
    this.calcWave(p5);

    p5.push();
    this.rotateWave(p5);
    this.setColor(p5);
    for (let x = 0; x < yPoints.length; x++) {
      let xPos = x * this.xSpacing.currentValue - this.windowWidth / 2;
      let yPos = p5.height / 2 + yPoints[ x ] - this.windowHeight / 2;


      this.renderShape(p5, xPos, yPos, this.radius.currentValue);
    }
    p5.pop();
  };
}
