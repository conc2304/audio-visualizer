import p5 from 'p5';
import P5Sketch from '../interfaces/P5Sketch.interface';
import easeInto from '../services/EasingService';
import { guidGenerator } from '../services/Utils';
import CatalogueDataEntry from '../services/CatalogueDataEntry';
import NumericProperty from '../services/PropertyConstructorNumeric';
import VariableProperty from '../services/PropertyConstructorVariable';

let deltaRotation = 0;

export default class RotaryTunnel implements P5Sketch {
  constructor (public windowWidth: number, public windowHeight: number) { }

  public catalogueInfo = new CatalogueDataEntry(
    this.constructor,
    'Rotatry Tunnel',
    'A Spinning Tunnel of Suff!',
    [ 'Particles', 'Tunnel' ],
    'clyzby',
    './assets/sketch_catalogue_gifs/noise-grid_200.gif',
    300,
    8,
    '2021-11-20',
  );

  public readonly sid = guidGenerator();
  public bypass = false;

  private readonly zMax = 600;
  private readonly zMin = -3000;
  private readonly zRange = this.zMax - this.zMin;

  /**
   * Sketch Parameters
   * */

  public orbitRadius = new NumericProperty('Orbit Radius', 'Base', 200, 5, 500, 0.7, 1);
  public pointSize = new NumericProperty('Point Size', 'Base', 40, 15, 400, 0.7, 1);
  public pointsQty = new NumericProperty('Points', 'Base', 8, 1, 40, 0.7, 1);
  public rotationVelocity = new NumericProperty('Rotation Speed', 'Base', 0.2, -2, 2, 0.7, 0.1);
  public fanAmount = new NumericProperty('Fan Amount', 'Base', 360, 0, 360, 0.7, 1);
  public zDepthDensity = new NumericProperty('Z Depth', 'Base', 5, 1, 20, 0.7, 0.5);
  public iterations = new NumericProperty('Iterations', 'Base', 3, 1, 15, 0.7, 1);

  public zRotationDelay = new NumericProperty('Z Rotation Delay', 'Base', 0, 0, 360, 0.7, 1);

  public shape = new VariableProperty("Shape", "Shape", 'torus', [ 'torus', 'plane', 'box', 'sphere', 'glock', 'ellipsoid', 'cylinder', 'cone', 'lambo', 'shuttle', 'ducky', 'whale', 'dolphin', 'satellite', 'sword' ]);



  public render(sketch: p5): void {
    const iterations = Math.floor(this.iterations.currentValue);
    const pointsQty = Math.floor(this.pointsQty.currentValue);
    const pointSize = this.pointSize.currentValue;
    const orbitRadius = this.orbitRadius.currentValue;
    const zDensity = this.zDepthDensity.currentValue;
    const zStep = (this.zRange / zDensity) / iterations;
    const zRotationDelay = this.zRotationDelay.currentValue;

    sketch.push();

    for (let i = 0; i < iterations; i++) {
      const zPos = this.zMax - (i * zStep);
      sketch.rotateZ(sketch.radians(i * zRotationDelay));
      this.createRotatingRing({ radius: orbitRadius, pointSize, pointsQty, z: zPos }, sketch);
    }

    sketch.pop();

    this.updateRotationDelta();

    // sketch.pop();
  }


  private orbitAroundOrigin = ({ radius = 20, anglePos = 0, z = 0 }, sketch: p5) => {
    const x = radius * Math.sin(anglePos);
    const y = radius * Math.cos(anglePos);
    sketch.translate(x, y, z);
  };

  private createRotatingRing = ({ radius = 20, pointSize = 20, pointsQty = 5, z = 0 }, sketch: p5) => {
    const theta = sketch.radians(this.fanAmount.currentValue / pointsQty);

    for (let point = 0; point < pointsQty; point++) {
      sketch.push();
      const anglePos = theta * point + deltaRotation;
      this.orbitAroundOrigin({ radius, anglePos, z }, sketch);
      this.renderShape(sketch);
      // sketch.sphere(pointSize);
      sketch.pop();
    }
  };

  private createZClones = (iterations = 1, repeaterFn) => {

    for (let i = 0; i < iterations; i++) {
      repeaterFn;
    }
  };

  private updateRotationDelta = () => {
    deltaRotation += this.rotationVelocity.currentValue * 0.01;
  };

  private renderShape = (sketch: p5) => {

    sketch.push();

    // this.rotateShape();
    const radius = this.pointSize.currentValue;
    const shape = this.shape.currentValue;

    switch (this.shape.currentValue) {
      case 'box':
      case 'sphere':
        sketch[ shape ](radius * 3);
        break;
      case 'plane':
      case 'torus':
        sketch[ shape ](radius * 3.5, radius * 1.5);
        break;
      case 'cylinder':
        sketch[ shape ](radius * 4, radius * 5);
        break;
      case 'cone':
        sketch[ shape ](radius * 5, radius * 20);
        break;
      case 'ellipsoid':
        sketch[ shape ](radius * (5), radius * (2), radius);
        break;
      case 'lambo':
      case 'glock':
      case 'shuttle':
      case 'ducky':
      case 'whale':
      case 'dolphin':
      case 'satellite':
      case 'sword':

        sketch.normalMaterial();

        sketch.scale(radius * 0.07);
        sketch.model(sketch[ 'objects' ][ shape.currentValue ]);
        break;
    }
    sketch.pop();
  };

  easeInto = easeInto;
}
