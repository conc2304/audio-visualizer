import NumericProperty from '@/js/services/PropertyConstructorNumeric';
import VariableProperty from '@/js/services/PropertyConstructorVariable';
import CatalogueDataEntry from '@/js/services/CatalogueDataEntry';
import {P5Base, P5Constructor, P5Sketch} from '../interfaces/P5Sketch.interface';
import p5 from 'p5';

let origin = 0;
let yPoints: Array<number> = [];
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

const loadedModelsPath = './assets/webgl_models';

export default class WEBGLWave extends P5Base implements P5Sketch {
  constructor () {
    super();
  }

  public catalogueInfo = new CatalogueDataEntry(
    this,
    '3D Sine Wave',
    'A parametric sine wave with various 3D shapes as point along the wave.',
    [ 'Parametric', '3D' ],
    'clyzby',
    'webgl-wave_200.gif',
    277,
    4,
    '2019-07-17',
  );

  public waveWidth = window.innerWidth + 200; // have some of it go off the page

  public shake = false;
  public shakeGain = 0.009; // should be make this a dial/ controllable by button

  public radius = new NumericProperty('Size', 'Base', 20, 15, 150, 0.7, 0.5);
  public elemQty = new NumericProperty('Number of Shapes', 'Base', 1, 1, 20, 0.7, 0.5);
  public xSpacing = new NumericProperty('X Spacing', 'Base', 300, 0, 900, 0.7, 1);
  public amplitude = new NumericProperty('Amplitude', 'Base', 75, 0, 500, 0.7, 1);
  public period = new NumericProperty('Period', 'Base', 500, 0, 850, 0.7, 1);
  public velocity = new NumericProperty('Velocity', 'Base', -0.001, 0.005, 0.2, 0.7, 0.0001);

  public rotateX = new NumericProperty('Rotate Shape X', 'Rotation', 0, -10, 10, 0.7,);
  public rotateY = new NumericProperty('Rotate Shape Y', 'Rotation', 0, -10, 10, 0.7,);
  public rotateZ = new NumericProperty('Rotate Shape Z', 'Rotation', 0, -10, 10, 0.7,);
  public waveRotateX = new NumericProperty('Rotate Wave X', 'Rotation', 0, -10, 10, 0.7,);
  public waveRotateY = new NumericProperty('Rotate Wave Y', 'Rotation', 0, -10, 10, 0.7,);
  public waveRotateZ = new NumericProperty('Rotate Wave Z', 'Rotation', 0, -10, 10, 0.7,);

  public translateX = new NumericProperty('Translate X', 'Position', 0, -900, 900, 0.7,);
  public translateY = new NumericProperty('Translate Y', 'Position', 0, -900, 900, 0.7,);
  public translateZ = new NumericProperty('Translate Z', 'Position', 0, -900, 900, 0.7,);

  public strokeHue = new NumericProperty('Line Color', 'Color', 200, 0, 360, 0.7,);
  public strokeWeight = new NumericProperty('Line Width', 'Color', 1, 1, 15, 0.7, 0.5);
  public fillHue = new NumericProperty('Fill Color', 'Color', 200, 0, 360, 0.7);
  public saturation = new NumericProperty('Saturation', 'Color', 100, 0, 100, 0.7,);
  public stroke = new VariableProperty('Outline and Fill', 'Color', 'Outline', [
    'Outline',
    'Fill + Outline',
  ]);

  public waveType = new VariableProperty('Wave Type', 'Base', 'sin', [
    'sin',
    'cos',
    'tan',
  ]);
  public shape = new VariableProperty('Shape', 'Base', 'torus', [
    'torus',
    'plane',
    'box',
    'sphere',
    'ellipsoid',
    'cylinder',
    'cone',
    ...loadedModels,
  ]);

  private calcWave = (p5: p5) => {
    yPoints = new Array(
      Math.floor(this.waveWidth / this.elemQty.currentValue),
    );

    const dx =
      (p5.TWO_PI / this.period.currentValue) * this.xSpacing.currentValue;
    this.waveType.currentValue = this.waveType.options.includes(
      this.waveType.currentValue,
    )
      ? this.waveType.currentValue
      : 'sin';
    origin += this.velocity.currentValue;
    let x = origin;
    for (let i = 0; i < yPoints.length; i++) {
      yPoints[ i ] =
        Math[ this.waveType.currentValue ](x) * this.amplitude.currentValue;
      x += dx;
    }
  };

  private rotateWave = (p5: p5) => {
    p5.rotateX(p5.frameCount * 0.01 * this.waveRotateX.currentValue);
    p5.rotateY(p5.frameCount * 0.01 * this.waveRotateY.currentValue);
    p5.rotateZ(p5.frameCount * 0.01 * this.waveRotateZ.currentValue);
  };

  private rotateShape = (p5: p5) => {
    p5.rotateX(p5.frameCount * 0.01 * this.rotateX.currentValue);
    p5.rotateY(p5.frameCount * 0.01 * this.rotateY.currentValue);
    p5.rotateZ(p5.frameCount * 0.01 * this.rotateZ.currentValue);
  };

  private setColor = (p5: p5) => {
    p5.strokeWeight(this.strokeWeight.currentValue);
    p5.stroke(this.strokeHue.currentValue, this.saturation.currentValue, 100);

    switch (this.stroke.currentValue) {
      case 'Outline':
        p5.noFill();
        break;
      case 'Fill + Outline':
        p5.fill(this.fillHue.currentValue, this.saturation.currentValue, 100);
        break;
    }
  };

  private renderShape = async (p5: p5) => {
    if (!p5[ 'objects' ]) p5[ 'objects' ] = {};

    p5.push();
    this.rotateShape(p5);
    const shape = this.shape.currentValue;
    const shapeRadiusMap = {
      box: [ 1 ],
      sphere: [ 3 ],
      plane: [ 1 ],
      torus: [ 3.5, 1.5 ],
      cylinder: [ 4, 5 ],
      cone: [ 5, 20 ],
      ellipsoid: [ 5, 2, 1 ]
    };

    if (loadedModels.includes(shape)) {
      if (!p5[ 'objects' ][ shape ]) {
        p5[ 'objects' ][ shape ] = p5.loadModel(
          `${loadedModelsPath}/${shape}.obj`,
          true,
        );
      }

      p5.normalMaterial();
      p5.scale(this.radius.currentValue * 0.07);
      p5.model(p5[ 'objects' ][ shape ]);

    } else {
      const shapeArgs = shapeRadiusMap[ shape ].map((radiusMult: number) => radiusMult * this.radius.currentValue);
      p5[ shape ](...shapeArgs);
    }

    p5.pop();
  };

  public render = (p5: p5) => {
    if (this.xSpacing.currentValue <= 0) {
      this.xSpacing.currentValue = this.xSpacing.min / 2;
    }

    if (this.elemQty.currentValue < this.elemQty.defaultMin) {
      this.elemQty.currentValue = this.elemQty.defaultMin;
    }

    let waveWidth =
      this.xSpacing.currentValue * Math.round(this.elemQty.currentValue - 1);

    this.calcWave(p5);
    this.rotateWave(p5);

    p5.translate(
      this.translateX.currentValue,
      this.translateY.currentValue,
      this.translateZ.currentValue,
    );

    if (!loadedModels.includes(this.shape.currentValue)) {
      this.setColor(p5);
    }

    for (let x = 0; x < this.elemQty.currentValue; x++) {
      let xPos = -(waveWidth / 2) + x * this.xSpacing.currentValue;
      let yPos = p5.height / 2 + yPoints[ x ] - this.windowHeight / 2;
      let zPos = 0;

      p5.push();
      p5.translate(xPos, yPos, zPos);
      this.renderShape(p5);
      p5.pop();
    }
  };
}

