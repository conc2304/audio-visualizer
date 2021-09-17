// Library Imports
import p5 from 'p5';
import SimplexNoise from "simplex-noise";

// App Imports
import Utils from '@/js/services/Utils';
import CatalogueDataEntry from '../services/CatalogueDataEntry';
import NumericProperty from '../services/PropertyConstructorNumeric';
import P5Sketch from '../interfaces/P5Sketch.interface';
import easeInto from '../services/EasingService';
import VariableProperty from '../services/PropertyConstructorVariable';


export default class ParticleGrid implements P5Sketch {

  constructor (public windowWidth: number, public windowHeight: number) {
  }

  public catalogueInfo = new CatalogueDataEntry(
    this.constructor,
    '3D Noise Grid',
    'Parametric noise grid in 3D!',
    [ 'Noise', '3D' ],
    'clyzby',
    './assets/sketch_catalogue_gifs/noise-grid_200.gif',
    300,
    8,
  );

  public sid = Utils.guidGenerator();
  public bypass = false;

  // Sketch Parameters
  public columns = new NumericProperty('Columns', 'Base', 25, 5, 40, 0.7, 1);
  public rows = new NumericProperty('Rows', 'Base', 25, 5, 40, 0.7, 1);
  public frequency = new NumericProperty('Frequency', 'Base', 20, 1, 100, 0.7, 1);
  public period = new NumericProperty('Period', 'Base', 50, 0, 100, 0.7, 1);
  public amplitude = new NumericProperty('Amplitude', 'Base', 3, 1, 8, 0.7, 0.1);
  public gridWidth = new NumericProperty('Grid Width', 'Base', window.innerWidth, window.innerWidth / 2, window.innerWidth * 4, 0.7, 0.5);
  public gridHeight = new NumericProperty('Grid Height', 'Base', window.innerHeight, window.innerHeight / 2, window.innerHeight * 4, 0.7, 0.5);
  public gapSize = new NumericProperty('Gap Size', 'Base', 5, 0, 100, 0.7, 1);

  public functionType = new VariableProperty('Type', 'Base', 'Ripple', [
    'Ripple',
    'Sine',
    'Noise'
  ]);
  public mirror = new VariableProperty('Mirror', 'Base', 'None', [
    'None',
    'X',
    'Y',
    'X & Y'
  ]);


  public zoomAmount = new NumericProperty(' Zoom', 'Transform', -700, -8000, 250, 0.7, 1);
  public rotateXBase = new NumericProperty('Rotate X (Base)', 'Transform', 0, -180, 180, 0.7, 1);
  public rotateXParticle = new NumericProperty('Rotate X (Particle)', 'Transform', 0, -180, 180, 0.7, 0.5);
  public rotateZVelocity = new NumericProperty('Z Rotation Speed', 'Transform', 0, 0, 10, 0.7, 0.5);


  public blackScale = new NumericProperty('Black Scale', 'Color', 0, 0, 100, 0.7, 1);
  public strokeHue = new NumericProperty('Line Color', 'Color', 200, 0, 360, 0.7, 1);
  public fillHue = new NumericProperty('Fill Color', 'Color', 200, 0, 360, 0.7, 1);
  public colorBanding = new NumericProperty('Banding', 'Color', 3, 0, 5, 0.7, 0.5);
  public fillSaturation = new NumericProperty('Fill Saturation', 'Color', 100, 0, 100, 0.7, 1);
  public strokeSaturation = new NumericProperty('Outline Saturation', 'Color', 100, 0, 100, 0.7, 1);
  public stroke = new VariableProperty('Outline and Fill', 'Color', 'Fill + Outline', [
    'Outline',
    'Fill + Outline',
  ]);

  private delta = 0;


  public render(sketch: p5): void {

    const functionType = this.functionType.currentValue.toLowerCase();
    const columns = Math.round(this.columns.currentValue);
    const rows = Math.round(this.rows.currentValue);
    const middleCol = Math.ceil((columns) * 0.5);
    const middleRow = Math.ceil((rows + 1) * 0.5);

    const hSpacing = this.gridWidth.currentValue / columns;
    const vSpacing = this.gridHeight.currentValue / rows;
    const gapSize = (100 - this.gapSize.currentValue) * 0.01;

    const particleWidth = Math.round(hSpacing * gapSize);
    const particleHeight = Math.round(vSpacing * gapSize);

    const periodAdjustmentMap = {
      noise: 0.0007,
      sine: 0.07
    };
    const period = this.period.currentValue * periodAdjustmentMap[ functionType ];

    const frequencyAdjustmentMap = {
      noise: 0.0001,
      sine: 0.0005,
    };

    const frequency = this.frequency.currentValue * frequencyAdjustmentMap[ functionType ];
    const amplitude = this.amplitude.currentValue;
    const time = sketch.frameCount * frequency;

    const originX = this.gridWidth.currentValue * 0.5;
    const originY = this.gridHeight.currentValue * 0.5;
    const center = new p5.Vector();
    center.x = originX;
    center.y = originY;

    const mirrorXOn = this.mirror.currentValue.indexOf("X") > -1;
    const mirrorYOn = this.mirror.currentValue.indexOf("Y") > -1;
    // let delta = 0;

    // transforms
    sketch.pop();
    sketch.translate(0, 0, this.zoomAmount.currentValue);
    sketch.rotateX(Utils.degreeToRadian(this.rotateXBase.currentValue));
    sketch.rotateZ(time * this.rotateZVelocity.currentValue);
    sketch.push();

    for (let y = 0; y < this.rows.currentValue; y++) {
      for (let x = 0; x < this.columns.currentValue; x++) {

        const xOrigin = (hSpacing * x) - originX;
        const yOrigin = (vSpacing * y) - originY;

        const xPos = (mirrorYOn && y >= middleRow) ? rows - y : y;
        const yPos = (mirrorXOn && x >= middleCol) ? columns - x : x;

        const pointVector = new p5.Vector();
        pointVector.x = xOrigin;
        pointVector.y = yOrigin;

        if (functionType === 'noise') {
          const z = this.simplex.noise3D(xPos * period, yPos * period, time);
          const zInstance = Math.floor(sketch.map(z, -1, 1, 0, 500 * (amplitude)));
          this.renderNoiseParticle(sketch, zInstance, xOrigin, yOrigin, particleWidth, particleHeight);

        } else if (functionType === 'sine') {

          // horizontal ||
          // const z = Math.sin(time + (yPos * 0.1) * period);
          // const zInstance = sketch.map(z, -1, 1, 0, 200 * amplitude);

          // 2d Sine /\/\/\
          // const z = Math.sin(time + (yPos * 0.1) * period) * Math.cos(time + xPos * 0.01 * period);


          // sine // with some rotation
          const z = Math.sin(time + ((yPos * 10) + xPos * 0.1) * period);
          // const z = Math.sin(time + ((yPos * 10) + xPos * 0.1) * period) * Math.cos(time + ((xPos * 10) + yPos * 0.1) * period);


          const zInstance = sketch.map(z, -1, 1, 0, 100 * amplitude);
          this.renderNoiseParticle(sketch, zInstance, xOrigin, yOrigin, particleWidth, particleHeight);
          // this.renderNoiseParticle(sketch, zInstance * 1.05, xOrigin, yOrigin, particleWidth * 0.5, particleHeight * 0.5);
          // this.renderNoiseParticle(sketch, zInstance * 1.15, xOrigin, yOrigin, particleWidth * 0.25, particleHeight * 0.25);
        } else if (functionType === 'ripple') {
          const Rsq = (x * x) + (y * y);
          const R = Math.sqrt(Rsq);
          const z = 0.5 * (1 + Math.sin(R));
          const zInstance = Math.floor(sketch.map(z, -1, 1, 10, 100 * amplitude));

          // console.log(z, zInstance);

          // this.renderNoiseParticle(sketch, zInstance, xOrigin, yOrigin, particleWidth, particleHeight);
          console.log(zInstance, xOrigin, yOrigin, particleWidth, particleHeight);
          this.renderNoiseParticle(sketch, zInstance, xOrigin, yOrigin, particleWidth, particleHeight);
        }

      }
    }
  }


  // Private Properties
  private simplex = new SimplexNoise(Math.random);

  // Private Methods

  private insideCircle(centerXY: p5.Vector, pointXY: p5.Vector, radius: number) {

    const dx = centerXY.x - pointXY.x;
    const dy = centerXY.y - pointXY.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= radius;
  }

  private renderNoiseParticle(sketch: p5, noiseInstance: number, xPos: number, yPos: number, width: number, height: number) {
    // console.log('renderNoise', width, height, noiseInstance);
    const depth = noiseInstance;
    sketch.push();
    this.setColor(sketch, noiseInstance);
    sketch.translate(xPos, yPos, 0);
    sketch.rotateX(Utils.degreeToRadian(this.rotateXParticle.currentValue));
    sketch.box(width, height, depth);
    sketch.pop();
  }

  private setColor(sketch: p5, noise?: number): void {
    let colorNoise: number;
    let brightnessNoise: number;

    const colorBanding = this.colorBanding.defaultMax - this.colorBanding.currentValue;
    switch (this.stroke.currentValue) {
      case 'Outline':
        colorNoise = (typeof noise !== 'undefined') ? (this.strokeHue.currentValue + Math.abs(noise)) % (this.strokeHue.defaultMax * colorBanding) : this.strokeHue.currentValue;
        sketch.strokeWeight(1);
        sketch.stroke(colorNoise, this.strokeSaturation.currentValue, 100);
        sketch.noFill();
        break;
      case 'Fill + Outline':
        sketch.strokeWeight(1);
        colorNoise = (typeof noise !== 'undefined') ? (this.fillHue.currentValue + Math.abs(noise)) % (this.fillHue.defaultMax * colorBanding) : this.fillHue.currentValue;
        brightnessNoise = (typeof noise !== 'undefined') ? (sketch.map(Math.abs(noise), 500, 1000, this.blackScale.defaultMax - this.blackScale.currentValue, 110, false)) : 100;
        sketch.stroke(this.strokeHue.currentValue, this.strokeSaturation.currentValue, 100);
        // sketch.fill(colorNoise, this.fillSaturation.currentValue, brightnessNoise);
        sketch.fill(100, 100, 100);
        break;
    }
  };

  easeInto = easeInto;
}

