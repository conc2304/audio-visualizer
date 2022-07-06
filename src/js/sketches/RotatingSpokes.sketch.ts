import p5 from 'p5';
import { P5Base, P5Sketch } from '../interfaces/P5Sketch.interface';
import CatalogueDataEntry from '../services/CatalogueDataEntry';
import NumericProperty from '../services/PropertyConstructorNumeric';
import VariableProperty from '../services/PropertyConstructorVariable';
import p5Helper, { loadCustomModel } from '../services/p5Helper';
import { P5_PRIMITIVES_3D, CUSTOM_MODELS } from '../constants';
import { CustomModelShape, WebglShape } from '../interfaces';

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

  public spokeQty = new NumericProperty('Spokes Qty', 'Base', 1, 1, 20, 0.7, 0.1);
  public pointsPerSpoke = new NumericProperty('Points per Spoke', 'Base', 1, 1, 30, 0.7, 0.1);
  public spokeLength = new NumericProperty('Spoke Length', 'Base', 400, 10, this.windowWidth * 0.75, 0.7, 0.1);
  public innerRadius = new NumericProperty('Inner Radius', 'Base', 0, 0, 300, 0.7, 0.1);
  public rotationVelocity = new NumericProperty('Rotation Speed', 'Base', 0.2, -2, 2, 0.7, 0.1);
  public pointSize = new NumericProperty('Point Size', 'Base', 20, 1, 100, 0.7, 0.05);
  public animationSpeed = new NumericProperty('Animation Speed', 'Base', 1, -5, 5, 0.7, 0.05);
  // public pointSpacing = new NumericProperty('Point Spacing', 'Base', 20, 1, 100, 0.7, 0.05);
  public fillHue = new NumericProperty('Color', 'Color', 200, 0, 360, 0.1, 1);
  public fillOpacity = new NumericProperty('Fill Opacity', 'Color', 200, 0, 100, 0.1, 1);
  public saturation = new NumericProperty('Saturation', 'Color', 100, 0, 100, 0.1, 1);

  private renderPoint(sketch: p5, i: number, props: PointProps) {
    const { pointRadius, innerRadius, spokeLength, spokeQty, pointsPerSpoke, rotationVelocity } =
      props;

    const time = sketch.frameCount;

    const spacing = spokeLength / pointsPerSpoke;
    const radius = i * spacing + innerRadius;
    console.log({ radius, spacing, i });

    const angle = 0 + time * rotationVelocity;
    const x = radius + sketch.sin(angle);
    const y = radius + sketch.cos(angle);

    sketch.ellipse(x, y, pointRadius);
  }

  private setColor = p5Helper.setColor;

  public render(sketch: p5): void {
    const spokeQty = Math.floor(this.spokeQty.currentValue);
    const pointsPerSpoke = Math.floor(this.pointsPerSpoke.currentValue);
    const spokeLength = this.spokeLength.currentValue;
    const pointRadius = this.pointSize.currentValue;
    const innerRadius = this.innerRadius.currentValue;
    const rotationVelocity = this.rotationVelocity.currentValue;
    // const fillColor = this.fillHue.currentValue;
    // const fillOpacity = this.fillOpacity.currentValue;
    // const time = sketch.frameCount;

    const points = new Array(spokeQty * pointsPerSpoke).fill(null);

    // sketch.ellipse(this.windowWidth / 2, this.windowHeight / 2, 100);
    // sketch.fill(200);
    sketch.ellipse(0, 0, 50);
    // console.log(points.length, spokeQty, spokeLength);
    points.map((_p, i) => {
      // console.log(_p, i);

      const pointProps: PointProps = {
        pointRadius,
        spokeQty,
        spokeLength,
        innerRadius,
        rotationVelocity,
        pointsPerSpoke,
      };
      sketch.push();
      sketch.fill(this.fillHue.currentValue, this.saturation.currentValue, 100);
      this.renderPoint(sketch, i, pointProps);
      sketch.pop();
    });
  }
}
