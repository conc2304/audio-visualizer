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

  public orbitRadius = new NumericProperty('Radius', 'Base', 25, 5, 500, 0.7, 1);
  public pointSize = new NumericProperty('Point Size', 'Base', 25, 15, 400, 0.7, 1);
  public pointsQty = new NumericProperty('Points', 'Base', 25, 1, 40, 0.7, 1);
  public rotationVelocity = new NumericProperty('Rotation Speed', 'Base', 0, -2, 2, 0.7, 0.1);

  public render(sketch: p5): void {
    const pointSize = this.pointSize.currentValue;
    const pointsQty = Math.floor(this.pointsQty.currentValue);
    const orbitRadius = this.orbitRadius.currentValue;
    // console.log('pointsQty', pointsQty)

    const theta = 360 / pointsQty;

    for (let i = 1; i < pointsQty; i++) {
      sketch.push();
      const x = Math.sin(deltaRotation + i * theta) * orbitRadius;
      const y = Math.cos(deltaRotation + i * theta) * orbitRadius;
      sketch.translate(x, y, 0);
      sketch.sphere(pointSize);
      sketch.pop();
    }

    // this.updateRotationDelta();
    deltaRotation += this.rotationVelocity.currentValue * 0.1;

    sketch.plane(50, 40);
  }

  private orbitAroundPoint = () => {};

  private updateRotationDelta = () => {
    deltaRotation += this.rotationVelocity.currentValue;
  };

  easeInto = easeInto;
}
