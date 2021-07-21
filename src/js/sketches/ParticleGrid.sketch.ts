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
  public noiseVelocity = new NumericProperty('Noise Speed', 'Base', 0, 1, 100, 0.7);
  public noiseAmount = new NumericProperty('Noise Amount', 'Base', 50, 0, 100, 0.7);
  public noiseAmplitude = new NumericProperty('Noise Amplitude', 'Base', 3, 1, 8, 0.7);

  public strokeHue = new NumericProperty('Line Color', 'Color', 200, 0, 360, 0.7);
  public fillHue = new NumericProperty('Fill Color', 'Color', 200, 0, 360, 0.7);
  public saturation = new NumericProperty('Saturation', 'Color', 100, 0, 100, 0.7);
  public stroke = new VariableProperty('Outline and Fill', 'Color', 'Outline', [
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

    for (let y = 0; y < this.columns.currentValue; y++) {
      for (let x = 0; x < this.rows.currentValue; x++) {
        const xPos = horizontalPadding + (hSpacing * y) - this.windowWidth * 0.5;
        const yPos = verticalPadding + (vSpacing * x) - this.windowHeight * 0.5;
        const n = this.simplex.noise3D(x * factor, y * factor, sketch.frameCount * velocity) * amplitude;
        const i = Math.floor(sketch.map(sketch.cos(n) * sketch.cos(n), -0.5, 0.8, 0, 1000));

        sketch.push();
        this.setColor(sketch, i);
        console.log(this.noiseZoom.currentValue);
        sketch.translate(xPos, yPos, this.noiseZoom.currentValue);
        sketch.box(hSpacing * 0.95, vSpacing * 0.95, i);
        sketch.pop();
      }
    }
  }

  easeInto = easeInto;
}
