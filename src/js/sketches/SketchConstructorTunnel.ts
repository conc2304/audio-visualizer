import easeInto from '@/js/services/EasingService';
import { guidGenerator } from '@/js/services/Utils';
import helper from '@/js/services/p5Helper.js';

import NumericProperty from '@/js/services/PropertyConstructorNumeric';
import VariableProperty from '@/js/services/PropertyConstructorVariable';
import CatalogueDataEntry from '@/js/services/CatalogueDataEntry';
import P5Sketch from '../interfaces/P5Sketch.interface';
import p5 from 'p5';

let zMax = 900;
let zMin = -6000;
let zDist = zMax - zMin;
let zPos = zMin;

export default class Tunnel implements P5Sketch {
  constructor (public windowWidth = window.innerWidth, public windowHeight = window.innerHeight) { }
  public sid = guidGenerator();

  public catalogueInfo = new CatalogueDataEntry(
    this.constructor,
    'Infinite Tunnel',
    'A generative never ending tunnel ',
    [ 'Generative', 'Tunnel', 'Loop' ],
    'StillClyzby',
    './assets/sketch_catalogue_gifs/tunnel_200.gif',
    202,
    1,
    '2020-09-19',
  );

  public bypass = false;



  public radius = new NumericProperty('Size', 'Base', 20, 0, 2000, 0.7, 0.5);
  public strokeWeight = new NumericProperty('Line Width', 'Base', 2, 2, 200, 0.7, 1);
  public iterations = new NumericProperty('Number of Objects', 'Base', 3, 0, 40, 0.5, 1);
  public tunnelSpeed = new NumericProperty('Speed', 'Base', 3, -50, 100, 0.5, 1);
  public shape = new VariableProperty('Shape', 'Base', 'square', [
    'line',
    'triangle',
    'square',
    'pentagon',
    'ellipse',
  ]);

  public translateX = new NumericProperty('Translate X', 'Position', 0, -900, 900, 0.7, 1);
  public translateY = new NumericProperty('Translate Y', 'Position', 0, -900, 900, 0.7, 1);

  public hue = new NumericProperty('Color', 'Color', 200, 0, 360, 0.1, 0.5);
  public saturation = new NumericProperty('Saturation', 'Color', 100, 0, 100, 0.1, 0.5);

  private renderShape = helper.renderShape;
  public easeInto = easeInto;

  public render = (p5: p5) => {
    p5.push();

    const frame = p5.frameCount;
    const zStep = zDist / this.iterations.currentValue;
    const tunnelPos = (frame * this.tunnelSpeed.currentValue) % zDist;

    p5.noFill();

    for (let i = 0; i < this.iterations.currentValue; i++) {
      p5.push();

      // make it restart from the minimum on loop
      const zToSet = zMin + tunnelPos + i * zStep;
      zPos = zToSet > zMax ? zToSet - zDist : zToSet;

      p5.translate(
        this.translateX.currentValue,
        this.translateY.currentValue,
        zPos,
      );

      p5.strokeWeight(this.strokeWeight.currentValue);
      const calc = p5.sin(p5.noise((frame + 2.5 * i) * 0.01));
      const wave = p5.map(calc, 0, 1, 0, 100);
      const hue = p5.map(
        calc,
        0,
        1,
        Number(this.hue.min),
        Number(this.hue.max),
      );
      const saturation = p5.map(
        calc,
        0,
        1,
        Number(this.saturation.min),
        Number(this.saturation.max),
      );

      if (i % 7 == 0) {
        p5.stroke(360 - this.hue.currentValue, saturation, 100);
      } else {
        p5.stroke(hue, this.saturation.currentValue, wave);
      }

      this.renderShape(p5, 0, 0, this.radius.currentValue);
      p5.pop();
    }
    p5.pop();
  };
}
