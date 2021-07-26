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

  constructor (public windowWidth: number, public windowHeight: number) { }

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
  public noiseZoom = new NumericProperty('Noise Zoom', 'Base', -700, -1000, 250, 0.7, 1);
  public columns = new NumericProperty('Columns', 'Base', 25, 5, 40, 0.7, 1);
  public rows = new NumericProperty('Rows', 'Base', 25, 5, 40, 0.7, 1);
  public noiseVelocity = new NumericProperty('Noise Speed', 'Base', 20, 1, 100, 0.7, 1);
  public noiseAmount = new NumericProperty('Noise Amount', 'Base', 50, 0, 100, 0.7, 1);
  public noiseAmplitude = new NumericProperty('Noise Amplitude', 'Base', 3, 1, 8, 0.7, 0.1);
  public rotateX = new NumericProperty('Rotate X', 'Base', -180, 0, 180, 0.7, 0.5);
  public mirror = new VariableProperty('Mirror', 'Base', 'None', [
    'None',
    'X',
    'Y',
    'X & Y'
  ]);

  public blackScale = new NumericProperty('Black Scale', 'Color', 0, 0, 100, 0.7, 1);
  public strokeHue = new NumericProperty('Line Color', 'Color', 200, 0, 360, 0.7, 1);
  public fillHue = new NumericProperty('Fill Color', 'Color', 200, 0, 360, 0.7, 1);
  public fillSaturation = new NumericProperty('Fill Saturation', 'Color', 100, 0, 100, 0.7, 1);
  public strokeSaturation = new NumericProperty('Outline Saturation', 'Color', 100, 0, 100, 0.7, 1);
  public stroke = new VariableProperty('Outline and Fill', 'Color', 'Fill + Outline', [
    'Outline',
    'Fill + Outline',
  ]);


  public render(sketch: p5): void {

    const columns = Math.round(this.columns.currentValue);
    const rows = Math.round(this.rows.currentValue);
    const middleCol = Math.ceil((columns) * 0.5) - 1;
    const middleRow = Math.ceil((rows + 1) * 0.5) - 1;

    const hSpacing = this.windowWidth / columns;
    const vSpacing = this.windowHeight / rows;

    const particleWidth = hSpacing * 0.95;
    const particleHeight = vSpacing * 0.95;

    const factor = this.noiseAmount.currentValue * 0.0007;
    const velocity = this.noiseVelocity.currentValue * 0.0001;
    const amplitude = this.noiseAmplitude.currentValue;

    const originX = this.windowWidth * 0.5;
    const originY = this.windowHeight * 0.5;
    const mirrorXOn = this.mirror.currentValue.indexOf("X") > -1;
    const mirrorYOn = this.mirror.currentValue.indexOf("Y") > -1;


    for (let y = 0; y < this.rows.currentValue; y++) {
      for (let x = 0; x < this.columns.currentValue; x++) {

        const xPos = (hSpacing * x) - originX;
        const yPos = (vSpacing * y) - originY;

        const noiseX = (mirrorYOn && y >= middleRow) ? rows - y : y;
        const noiseY = (mirrorXOn && x >= middleCol) ? columns - x : x;

        const n = this.simplex.noise3D(noiseX * factor, noiseY * factor, sketch.frameCount * velocity) * amplitude;
        const noiseInstance = Math.floor(sketch.map(sketch.cos(n) * sketch.cos(n), -0.5, 0.8, 0, 1000));

        this.renderNoiseParticle(sketch, noiseInstance, xPos, yPos, particleWidth, particleHeight);
      }
    }
  }


  // Private Properties
  private simplex = new SimplexNoise(Math.random);

  // Private Methods

  private renderNoiseParticle(sketch: p5, noiseInstance: number, xPos: number, yPos: number, width: number, height: number) {
    sketch.push();
    this.setColor(sketch, noiseInstance);
    sketch.translate(xPos, yPos, this.noiseZoom.currentValue);
    sketch.rotateX(Utils.degreeToRadian(this.rotateX.currentValue));
    sketch.box(width, height, noiseInstance);
    sketch.pop();
  }

  private setColor(sketch: p5, noise?: number): void {
    let colorNoise: number;
    let brightnessNoise: number;

    switch (this.stroke.currentValue) {
      case 'Outline':
        colorNoise = (typeof noise !== 'undefined') ? (this.strokeHue.currentValue + noise) % this.strokeHue.defaultMax : this.strokeHue.currentValue;
        sketch.strokeWeight(1);
        sketch.stroke(colorNoise, this.strokeSaturation.currentValue, 100);
        sketch.noFill();
        break;
      case 'Fill + Outline':
        sketch.strokeWeight(1);
        colorNoise = (typeof noise !== 'undefined') ? (this.fillHue.currentValue + noise) % this.fillHue.defaultMax : this.fillHue.currentValue;
        brightnessNoise = (typeof noise !== 'undefined') ? (sketch.map(noise, 500, 1000, this.blackScale.defaultMax - this.blackScale.currentValue, 110, false)) : 100;
        sketch.stroke(this.strokeHue.currentValue, this.strokeSaturation.currentValue, 100);
        sketch.fill(colorNoise, this.fillSaturation.currentValue, brightnessNoise);
        break;
    }
  };

  easeInto = easeInto;
}

