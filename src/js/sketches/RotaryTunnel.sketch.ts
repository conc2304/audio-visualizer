import p5 from 'p5';
import P5Sketch from '../interfaces/P5Sketch.interface';
import easeInto from '../services/EasingService';
import { guidGenerator } from '../services/Utils';
import CatalogueDataEntry from '../services/CatalogueDataEntry';
import NumericProperty from '../services/PropertyConstructorNumeric';

let deltaRotation = 0;

export default class RotaryTunnel implements P5Sketch {
  constructor(public windowWidth: number, public windowHeight: number) {}

  public catalogueInfo = new CatalogueDataEntry(
    this.constructor,
    'Rotatry Tunnel',
    'A Spinning Tunnel of Suff!',
    ['Particles', 'Tunnel'],
    'clyzby',
    './assets/sketch_catalogue_gifs/noise-grid_200.gif',
    300,
    8,
    '2021-11-20',
  );

  public readonly sid = guidGenerator();
  public bypass = false;

  private readonly zMax = 900;
  private readonly zMin = -6000;
  private readonly zDist = this.zMax - this.zMin;

  /**
   * Sketch Parameters
   * */

  public orbitRadius = new NumericProperty('Radius', 'Base', 80, 5, 500, 0.7, 1);
  public pointSize = new NumericProperty('Point Size', 'Base', 40, 15, 400, 0.7, 1);
  public pointsQty = new NumericProperty('Points', 'Base', 8, 1, 40, 0.7, 1);
  public rotationVelocity = new NumericProperty('Rotation Speed', 'Base', 0.25, -2, 2, 0.7, 0.1);
  public fanAmoutn = new NumericProperty('Fan Amount', 'Base', 360, 0, 360, 0.7, 1);
  public zDepthDensity = new NumericProperty('Z Depth', 'Base', 5, 1, 20, 0.7, 1)

  public render(sketch: p5): void {
    const pointSize = this.pointSize.currentValue;
    const pointsQty = Math.floor(this.pointsQty.currentValue);
    const orbitRadius = this.orbitRadius.currentValue;

    const theta = this.fanAmoutn.currentValue / pointsQty;

    // for (let z = 0; z > this.zMin; z - (z * (this.zMin this.zDepthDensity.currentValue))){

    // }

    for (let i = 0; i < pointsQty; i++) {
      sketch.push();
      const x = orbitRadius * Math.cos(theta * i);
      const y = orbitRadius * Math.cos(theta * i);
      sketch.translate(x, y, 0);
      sketch.sphere(pointSize);
      sketch.pop();
    }

    this.updateRotationDelta();
    // deltaRotation += this.rotationVelocity.currentValue * 0.1;

    sketch.plane(50, 40);
  }

  private orbitAroundPoint = () => {};

  private updateRotationDelta = () => {
    deltaRotation += this.rotationVelocity.currentValue * 0.1;
  };

  easeInto = easeInto;
}
