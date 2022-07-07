// Library Imports
import p5 from 'p5';
import SimplexNoise from 'simplex-noise';

// App Imports
import { P5Base, P5Sketch } from '../interfaces/P5Sketch.interface';
import CatalogueDataEntry from '../services/CatalogueDataEntry';
import NumericProperty from '../services/PropertyConstructorNumeric';
// import VariableProperty from '../services/PropertyConstructorVariable';
import p5Helper, { loadCustomModel } from '../services/p5Helper';
// import { P5_PRIMITIVES_3D, CUSTOM_MODELS } from '../constants';
// import { CustomModelShape, WebglShape } from '../interfaces';

type PointProps = {
  pointRadius: number;
  spokeQty: number;
  spokeLength: number;
  // fillColor: number;
  // fillOpacity: number;
  // strokeWidth: number;
  // strokeColor: number;
  // strokeOpacity: number;
  innerRadius: number;
  rotationVelocity: number;
  pointsPerSpoke: number;
};

export default class RotatingSpokes extends P5Base implements P5Sketch {
  constructor() {
    super();
  }

  public catalogueInfo = new CatalogueDataEntry(
    this,
    'Rotatry Spokes',
    'A Spinning Delight',
    ['Particles', 'Rotation', 'Spinning'],
    'clyzby',
    'rotary-tunnel_200.gif',
    300,
    8,
    '2021-11-20',
  );

  public spokeQty = new NumericProperty('Spokes Qty', 'Base', 3, 1, 20, 1, 1);
  public pointsPerSpoke = new NumericProperty('Points per Spoke', 'Base', 5, 1, 30, 1, 1);
  public spokeLength = new NumericProperty(
    'Spoke Length',
    'Base',
    400,
    10,
    this.windowWidth * 0.75,
    0.7,
    0.1,
  );
  public innerRadius = new NumericProperty('Inner Radius', 'Base', 0, 0, 300, 0.7, 0.1);
  public rotationVelocity = new NumericProperty('Rotation Speed', 'Base', 0.1, 0, 3, 0.4, 0.05);
  public pointSize = new NumericProperty('Point Size', 'Base', 20, 1, 100, 0.7, 0.05);
  // public animationSpeed = new NumericProperty('Animation Speed', 'Base', 1, -5, 5, 0.7, 0.05);
  public fillHue = new NumericProperty('Color', 'Color', 200, 0, 360, 0.1, 1);
  public fillOpacity = new NumericProperty('Fill Opacity', 'Color', 200, 0, 100, 0.1, 1);
  public saturation = new NumericProperty('Saturation', 'Color', 100, 0, 100, 0.1, 1);

  private simplex = new SimplexNoise(Math.random);

  private renderPoint(sketch: p5, i: number, props: PointProps) {
    const {
      pointRadius,
      innerRadius,
      spokeLength,
      spokeQty,
      pointsPerSpoke,
      rotationVelocity,
    } = props;

    const spacing = spokeLength / pointsPerSpoke;
    const radius = innerRadius + (i % pointsPerSpoke) * spacing;

    const angle = sketch.radians(360 / spokeQty);
    const time = sketch.frameCount;
    const delta = time * rotationVelocity * -0.1;
    const theta = angle * (i % spokeQty) + delta;
    const x = radius * sketch.sin(theta);
    const y = radius * sketch.cos(theta);

    this.setColor({ sketch, i, x, y, delta });
    sketch.ellipse(x, y, pointRadius);
  }

  private setColor({
    sketch,
    i,
    x,
    y,
    delta,
  }: {
    sketch: p5;
    i: number;
    x: number;
    y: number;
    delta: number;
  }): void {
    const hue = this.simplex.noise3D(x * 0.001, y * 0.001, delta) * 360; // todo these should be configurable equations
    const saturation = 100;
    const brightness = 100;
    const color = sketch.color(hue, saturation, brightness);
    const alpha = 100;
    color.setAlpha(alpha);
    sketch.fill(color);
  }

  public render(sketch: p5): void {
    const spokeQty = Math.floor(this.spokeQty.currentValue);
    const pointsPerSpoke = Math.floor(this.pointsPerSpoke.currentValue);
    const spokeLength = this.spokeLength.currentValue;
    const pointRadius = this.pointSize.currentValue;
    const innerRadius = this.innerRadius.currentValue;
    const rotationVelocity = this.rotationVelocity.currentValue;

    const points = new Array(spokeQty * pointsPerSpoke).fill(null);

    points.map((_p: null, i: number): void => {
      const pointProps: PointProps = {
        pointRadius,
        spokeQty,
        spokeLength,
        innerRadius,
        rotationVelocity,
        pointsPerSpoke,
      };

      sketch.push();
      this.renderPoint(sketch, i, pointProps);
      sketch.pop();
    });
  }
}
