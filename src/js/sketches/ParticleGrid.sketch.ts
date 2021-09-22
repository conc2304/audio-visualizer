// Library Imports
import p5 from 'p5';
import SimplexNoise from "simplex-noise";

// App Imports
import { guidGenerator, degreeToRadian } from '@/js/services/Utils';
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
    '2021-08-15'
  );

  public sid = guidGenerator();
  public bypass = false;

  public dynamicProps = {
    columns: new NumericProperty('Columns', 'Base', 25, 5, 40, 0.7, 1),
    rows: new NumericProperty('Rows', 'Base', 25, 5, 40, 0.7, 1),
    frequency: new NumericProperty('Frequency', 'Base', 20, 1, 100, 0.7, 1),
    period: new NumericProperty('Period', 'Base', 50, 0, 100, 0.7, 1),
    amplitude: new NumericProperty('Amplitude', 'Base', 3, 1, 8, 0.7, 0.1),
    gridWidth: new NumericProperty('Grid Width', 'Base', window.innerWidth, window.innerWidth / 2, window.innerWidth * 4, 0.7, 0.5),
    gridHeight: new NumericProperty('Grid Height', 'Base', window.innerHeight, window.innerHeight / 2, window.innerHeight * 4, 0.7, 0.5),
    mirror: new VariableProperty('Mirror', 'Base', 'None', [
      'None',
      'X',
      'Y',
      'X & Y'
    ]),

    zoomAmount: new NumericProperty(' Zoom', 'Transform', -700, -1000, 250, 0.7, 1),
    rotateXBase: new NumericProperty('Rotate X (Base)', 'Transform', 0, -180, 180, 0.7, 1),
    rotateXParticle: new NumericProperty('Rotate X (Particle)', 'Transform', 0, -180, 180, 0.7, 0.5),
    rotateZVelocity: new NumericProperty('Z Rotation Speed', 'Transform', 0, 0, 10, 0.7, 0.5),


    blackScale: new NumericProperty('Black Scale', 'Color', 0, 0, 100, 0.7, 1),
    strokeHue: new NumericProperty('Line Color', 'Color', 200, 0, 360, 0.7, 1),
    fillHue: new NumericProperty('Fill Color', 'Color', 200, 0, 360, 0.7, 1),
    fillSaturation: new NumericProperty('Fill Saturation', 'Color', 100, 0, 100, 0.7, 1),
    strokeSaturation: new NumericProperty('Outline Saturation', 'Color', 100, 0, 100, 0.7, 1),
    stroke: new VariableProperty('Outline and Fill', 'Color', 'Fill + Outline', [
      'Outline',
      'Fill + Outline',
    ]),
  };
  // Sketch Parameters


  public render = (p5: p5, props: any = this): void => {

    const sketchProps = this.dynamicProps;


    const columns = Math.round(sketchProps.columns.currentValue);
    const rows = Math.round(sketchProps.rows.currentValue);
    const middleCol = Math.ceil((columns) * 0.5);
    const middleRow = Math.ceil((rows + 1) * 0.5);

    const hSpacing = sketchProps.gridWidth.currentValue / columns;
    const vSpacing = sketchProps.gridHeight.currentValue / rows;

    const particleWidth = hSpacing * 0.95;
    const particleHeight = vSpacing * 0.95;

    const periodAdjustmentMap = {
      noise: 0.0007,
      sin: 0.07
    };
    const period = sketchProps.period.currentValue * periodAdjustmentMap.noise;

    const frequencyAdjustmentMap = {
      noise: 0.0001,
      sin: 0.0001,
    };

    const frequency = sketchProps.frequency.currentValue * frequencyAdjustmentMap.noise;
    const amplitude = sketchProps.amplitude.currentValue;
    const time = p5.frameCount * frequency;

    const originX = sketchProps.gridWidth.currentValue * 0.5;
    const originY = sketchProps.gridHeight.currentValue * 0.5;
    const mirrorXOn = sketchProps.mirror.currentValue.indexOf("X") > -1;
    const mirrorYOn = sketchProps.mirror.currentValue.indexOf("Y") > -1;

    p5.pop();
    p5.translate(0, 0, sketchProps.zoomAmount.currentValue);
    p5.rotateX(degreeToRadian(sketchProps.rotateXBase.currentValue));
    p5.rotateZ(time * sketchProps.rotateZVelocity.currentValue);
    p5.push();
    for (let y = 0; y < sketchProps.rows.currentValue; y++) {
      for (let x = 0; x < sketchProps.columns.currentValue; x++) {

        const xOrigin = (hSpacing * x) - originX;
        const yOrigin = (vSpacing * y) - originY;

        const xPos = (mirrorYOn && y >= middleRow) ? rows - y : y;
        const yPos = (mirrorXOn && x >= middleCol) ? columns - x : x;

        const z = this.simplex.noise3D(xPos * period, yPos * period, time);
        const zInstance = Math.floor(p5.map(z, -0.1, 1, 0, 500 * (amplitude)));

        this.renderNoiseParticle(p5, zInstance, xOrigin, yOrigin, particleWidth, particleHeight);
      }
    }
  };


  // Private Properties
  private simplex = new SimplexNoise(Math.random);

  // Private Methods

  private renderNoiseParticle(p5: p5, noiseInstance: number, xPos: number, yPos: number, width: number, height: number) {
    p5.push();
    this.setColor(p5, noiseInstance);
    p5.translate(xPos, yPos, 0);
    p5.rotateX(degreeToRadian(this.dynamicProps.rotateXParticle.currentValue));
    p5.box(width, height, noiseInstance);
    p5.pop();
  }

  private setColor(p5: p5, noise?: number): void {
    let colorNoise: number;
    let brightnessNoise: number;

    switch (this.dynamicProps.stroke.currentValue) {
      case 'Outline':
        colorNoise = (typeof noise !== 'undefined') ? (this.dynamicProps.strokeHue.currentValue + Math.abs(noise)) % this.dynamicProps.strokeHue.defaultMax : this.dynamicProps.strokeHue.currentValue;
        p5.strokeWeight(1);
        p5.stroke(colorNoise, this.dynamicProps.strokeSaturation.currentValue, 100);
        p5.noFill();
        break;
      case 'Fill + Outline':
        p5.strokeWeight(1);
        colorNoise = (typeof noise !== 'undefined') ? (this.dynamicProps.fillHue.currentValue + Math.abs(noise)) % this.dynamicProps.fillHue.defaultMax : this.dynamicProps.fillHue.currentValue;
        brightnessNoise = (typeof noise !== 'undefined') ? (p5.map(Math.abs(noise), 500, 1000, this.dynamicProps.blackScale.defaultMax - this.dynamicProps.blackScale.currentValue, 110, false)) : 100;
        p5.stroke(this.dynamicProps.strokeHue.currentValue, this.dynamicProps.strokeSaturation.currentValue, 100);
        p5.fill(colorNoise, this.dynamicProps.fillSaturation.currentValue, brightnessNoise);
        break;
    }
  };

  public easeInto = easeInto.bind(this);
}

