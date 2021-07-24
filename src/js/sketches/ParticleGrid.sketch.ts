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
    'Parametric Shapes',
    'A collection of simple parametric shapes.',
    [ 'Parametric' ],
    'clyzby',
    './assets/sketch_catalogue_gifs/parametric-1_200.gif',
    300,
    2,
  );

  public sid = Utils.guidGenerator();
  public bypass = false;
  private simplex = new SimplexNoise(Math.random);

  // Sketch Parameters
  public noiseZoom = new NumericProperty('Noise Zoom', 'Base', -250, -700, 250, 0.7);
  public columns = new NumericProperty('Columns', 'Base', 20, 5, 40, 0.7);
  public rows = new NumericProperty('Rows', 'Base', 20, 5, 40, 0.7);
  public noiseVelocity = new NumericProperty('Noise Speed', 'Base', 20, 1, 100, 0.7);
  public noiseAmount = new NumericProperty('Noise Amount', 'Base', 50, 0, 100, 0.7);
  public noiseAmplitude = new NumericProperty('Noise Amplitude', 'Base', 3, 1, 8, 0.7);
  public mirror = new VariableProperty('Mirror', 'Base', 'None', [
    'None',
    'X',
    'Y',
    'X & Y'
  ]);

  public strokeHue = new NumericProperty('Line Color', 'Color', 200, 0, 360, 0.7);
  public fillHue = new NumericProperty('Fill Color', 'Color', 200, 0, 360, 0.7);
  public saturation = new NumericProperty('Saturation', 'Color', 100, 0, 100, 0.7);
  public stroke = new VariableProperty('Outline and Fill', 'Color', 'Fill + Outline', [
    'Outline',
    'Fill + Outline',
  ]);



  private setColor(sketch: p5, noise?: number) {
    let colorNoise: number;

    switch (this.stroke.currentValue) {
      case 'Outline':
        colorNoise = (typeof noise !== 'undefined') ? (this.strokeHue.currentValue + noise) % this.strokeHue.defaultMax : this.strokeHue.currentValue;

        sketch.strokeWeight(1);
        sketch.stroke(colorNoise, this.saturation.currentValue, 100);
        sketch.noFill();
        break;
      case 'Fill + Outline':
        sketch.strokeWeight(1);
        colorNoise = (typeof noise !== 'undefined') ? (this.fillHue.currentValue + noise) % this.fillHue.defaultMax : this.fillHue.currentValue;

        sketch.stroke(this.strokeHue.currentValue, this.saturation.currentValue, 100);
        sketch.fill(colorNoise, this.saturation.currentValue, 100);
        break;
    }
  };

  public render(sketch: p5) {
    const paddingPercent = 5;
    const horizontalPadding = this.windowWidth * (paddingPercent * 0.01);
    const verticalPadding = this.windowHeight * (paddingPercent * 0.01);
    const hSpacing = this.windowWidth / this.columns.currentValue;
    const vSpacing = this.windowHeight / this.rows.currentValue;
    const factor = this.noiseAmount.currentValue * 0.0007;
    const velocity = this.noiseVelocity.currentValue * 0.0001;
    const amplitude = this.noiseAmplitude.currentValue;
    const middleCol = Math.ceil(this.columns.currentValue * 0.5);
    const middleRow = Math.ceil(this.rows.currentValue * 0.5);
    const mirrorXOn = this.mirror.currentValue.indexOf("X") > -1;
    const mirrorYOn = this.mirror.currentValue.indexOf("Y") > -1;

    for (let y = 0; y < this.columns.currentValue; y++) {
      for (let x = 0; x < this.rows.currentValue; x++) {

        const xPos = horizontalPadding + (hSpacing * y) - this.windowWidth * 0.5;
        const yPos = verticalPadding + (vSpacing * x) - this.windowHeight * 0.5;

        const noiseX = (mirrorXOn && y > middleRow) ? this.rows.currentValue - y : y;
        const noiseY = (mirrorYOn && x > middleCol) ? this.columns.currentValue - x : x;

        const n = this.simplex.noise3D(noiseX * factor, noiseY * factor, sketch.frameCount * velocity) * amplitude;
        const i = Math.floor(sketch.map(sketch.cos(n) * sketch.cos(n), -0.5, 0.8, 0, 1000));

        // 1 - 2 - 3 - 4 - 5 - 5 - 4 - 3 - 2 - 1
        // 1 - 2 - 3 - 4 - 5 - 5 - 4 - 3 - 2 - 1
        // 1 - 2 - 3 - 4 - 5 - 5 - 4 - 3 - 2 - 1


        sketch.push();
        this.setColor(sketch, i);
        sketch.translate(xPos, yPos, this.noiseZoom.currentValue);
        sketch.box(hSpacing * 0.95, vSpacing * 0.95, i);
        sketch.pop();
      }
    }
  }

  renderGridParticleBox(sketch: p5, i: number, xPos: number, yPos: number) {


    // sketch.push();
    // this.setColor(sketch, i);
    // sketch.translate(xPos, yPos, this.noiseZoom.currentValue);
    // sketch.box(hSpacing * 0.95, vSpacing * 0.95, i);
    // sketch.pop();
  }

  easeInto = easeInto;
}
