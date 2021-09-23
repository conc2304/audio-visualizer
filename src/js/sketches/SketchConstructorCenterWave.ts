import easeInto from '@/js/services/EasingService';
import { render2DShape, rotateShape, setColor } from '@/js/services/p5Helper';
import { guidGenerator } from '../services/Utils';
import NumericProperty from '@/js/services/PropertyConstructorNumeric';
import VariableProperty from '@/js/services/PropertyConstructorVariable';
import CatalogueDataEntry from '@/js/services/CatalogueDataEntry';
import P5Sketch from '../interfaces/P5Sketch.interface';
import p5 from 'p5';

export default class CenterWave implements P5Sketch {
  constructor (public windowWidth: number, public windowHeight: number) {
  }
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

  public dynamicProps = {
    radius: new NumericProperty('Size', 'Base', 20, -1000, 2000, 0.7, 10),
    velocity: new NumericProperty(
      'Velocity',
      'Base',
      0.025,
      -0.5,
      0.5,
      0.1,
      0.05,
    ),
    amplitude: new NumericProperty(
      'Amplitude',
      'Base',
      75,
      -1500,
      2000,
      0.1,
      10,
    ),
    period: new NumericProperty(
      'Period',
      'Base',
      500,
      0,
      10250,
      0.07,
      10,
    ),
    xSpacing: new NumericProperty(
      'X Spacing',
      'Base',
      40,
      1,
      350,
      0.7,
      1,
    ),

    waveRotateX: new NumericProperty(
      'Rotate Wave X',
      'Rotation',
      0,
      -10,
      10,
      0.7,
      1,
    ),
    waveRotateXVelocity: new NumericProperty(
      'Rotate Wave X Velocity',
      'Rotation',
      0,
      -0.2,
      0.2,
      0.7,
      0.05,
    ),
    waveRotateY: new NumericProperty(
      'Rotate Wave Y',
      'Rotation',
      0,
      -10,
      10,
      0.7,
      0.05,
    ),
    waveRotateYVelocity: new NumericProperty(
      'Rotate Wave Y Velocity',
      'Rotation',
      0,
      -0.2,
      0.2,
      0.7,
      0.05,
    ),
    waveRotateZ: new NumericProperty(
      'Rotate Wave Z',
      'Rotation',
      0,
      -10,
      10,
      0.7,
      0.1,
    ),
    waveRotateZVelocity: new NumericProperty(
      'Rotate Wave Z Velocity',
      'Rotation',
      0,
      -0.2,
      0.2,
      0.7,
      0.05,
    ),

    hue: new NumericProperty('Color', 'Color', 200, 0, 360, 0.1, 1),
    saturation: new NumericProperty(
      'Saturation',
      'Color',
      100,
      0,
      100,
      0.1,
      1,
    ),

    waveType: new VariableProperty('Wave Type', 'Base', 'sin', [
      'sin',
      'cos',
      'tan',
    ]),
    shape: new VariableProperty('Shape', 'Base', 'ellipse', [
      'line',
      'triangle',
      'square',
      'pentagon',
      'ellipse',
    ]),

    coloringMode: new VariableProperty('Outline and Fill', 'Color', 'Outline', [
      'Outline',
      'Filled',
    ]),
  };

  private yPoints = [];
  private origin = 0;
  private waveWidth = window.innerWidth + 200; // have some of it go off the page

  private rotateShape = rotateShape;
  private setColor = setColor;
  private renderShape = render2DShape;

  public easeInto = easeInto.bind(this);

  /**
 * Based on the current wave period and spacing between x points
 * get the location of the y points to be rendered in the wave
 */
  private calcWave = (p5: p5) => {

    const dx =
      (p5.TWO_PI / this.dynamicProps.period.currentValue) * this.dynamicProps.xSpacing.currentValue;

    this.dynamicProps.waveType.currentValue = this.dynamicProps.waveType.options.includes(
      this.dynamicProps.waveType.currentValue,
    )
      ? this.dynamicProps.waveType.currentValue
      : 'sin';

    this.origin += this.dynamicProps.velocity.currentValue;
    let x = this.origin;

    this.yPoints = new Array(
      Math.ceil(this.waveWidth / this.dynamicProps.xSpacing.currentValue),
    );

    for (let i = 0; i < this.yPoints.length; i++) {
      this.yPoints[ i ] =
        Math[ this.dynamicProps.waveType.currentValue ](x) * this.dynamicProps.amplitude.currentValue;
      x += dx;
    }
  };

  private rotateWave = (p5: p5) => {
    p5.rotateX(
      p5.frameCount * this.dynamicProps.waveRotateXVelocity.currentValue +
      this.dynamicProps.waveRotateX.currentValue,
    );
    p5.rotateY(
      p5.frameCount * this.dynamicProps.waveRotateYVelocity.currentValue +
      this.dynamicProps.waveRotateY.currentValue,
    );
    p5.rotateZ(
      p5.frameCount * this.dynamicProps.waveRotateZVelocity.currentValue +
      this.dynamicProps.waveRotateZ.currentValue,
    );
  };

  /**
 * Paint the object onto the screen based on the object's attributes.
 */
  public render = (p5: p5) => {

    if (p5.frameCount % 120 == 0) console.log(this);
    const { dynamicProps } = this;

    if (dynamicProps.xSpacing.currentValue <= 0) {
      dynamicProps.xSpacing.currentValue = dynamicProps.xSpacing.min / 2;
    }
    this.yPoints = new Array(
      Math.ceil(this.waveWidth / dynamicProps.xSpacing.currentValue),
    );
    this.calcWave(p5);

    p5.push();
    this.rotateWave(p5);
    this.setColor(p5, dynamicProps.coloringMode.currentValue, dynamicProps.hue.currentValue, dynamicProps.saturation.currentValue);
    for (let x = 0; x < this.yPoints.length; x++) {
      let xPos = x * dynamicProps.xSpacing.currentValue - this.windowWidth / 2;
      let yPos = p5.height / 2 + this.yPoints[ x ] - this.windowHeight / 2;

      const args = {
        xPos,
        yPos,
        radius: dynamicProps.radius.currentValue,
        shape: dynamicProps.shape.currentValue,
      };
      // console.log(args.shape, this.shape.currentValue);
      this.renderShape(p5, xPos, yPos, dynamicProps.radius.currentValue, dynamicProps.shape.currentValue);
    }
    p5.pop();
  };
}










