import p5 from 'p5';
import { P5Base, P5Sketch } from '../interfaces/P5Sketch.interface';
import CatalogueDataEntry from '../services/CatalogueDataEntry';
import NumericProperty from '../services/PropertyConstructorNumeric';
import VariableProperty from '../services/PropertyConstructorVariable';
// <<<<<<< HEAD
// import p5Helper from '../services/p5Helper';
// import { CATALOGUE_ITEM_AVATAR_DIR, CUSTOM_MODELS_DIR, P5_PRIMITIVES_3D, SKETCH_PROPERTY_3D_SHAPE, WEBGL_MODELS } from '../constants';
// =======
import p5Helper, { loadCustomModel } from '../services/p5Helper';
import { P5_PRIMITIVES_3D, CUSTOM_MODELS } from '../constants';
import { CustomModelShape, WebglShape } from '../interfaces';
// >>>>>>> 2e623f67975bc3c819f249b889504d9099408b5c

let deltaRotation = 0;
let deltaRotationX = 0;
let deltaRotationY = 0;
let deltaRotationZ = 0;
let deltaTunnel = 0;

export default class RotaryTunnel extends P5Base implements P5Sketch {
  constructor () {
    super();
  }

  public catalogueInfo = new CatalogueDataEntry(
    // <<<<<<< HEAD
    //     this.constructor,
    //     'Rotary Tunnel',
    //     'A Spinning Tunnel of Stuff!',
    //     [ 'Particles', 'Tunnel', 'Spinning' ],
    //     'clyzby',
    //     `${CATALOGUE_ITEM_AVATAR_DIR}/rotary-tunnel_200.gif`,
    // =======
    this,
    'Rotatry Tunnel',
    'A Spinning Tunnel of Stuff!',
    [ 'Particles', 'Tunnel' ],
    'clyzby',
    'rotary-tunnel_200.gif',
    // >>>>>>> 2e623f67975bc3c819f249b889504d9099408b5c
    300,
    8,
    '2021-11-20',
  );


  private readonly zMax = 1000;
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
  public zDepthDensity = new NumericProperty('Z Depth', 'Base', 1, 1, 20, 0.7, 0.5);
  public iterations = new NumericProperty('Iterations', 'Base', 3, 1, 15, 0.7, 1);

  public cloneRotationOffset = new NumericProperty('Z Rotation Delay', 'Base', 0, 0, 360, 0.7, 1);

  // <<<<<<< HEAD
  //   public shape = SKETCH_PROPERTY_3D_SHAPE;
  // =======
  public shape = new VariableProperty(
    'Shape',
    'Shape',
    'sphere',
    [].concat(P5_PRIMITIVES_3D, CUSTOM_MODELS),
  );
  // >>>>>>> 2e623f67975bc3c819f249b889504d9099408b5c

  public rotateX = new NumericProperty('Rotate X', 'Rotation', 0, -10, 10, 0.7, 0.1);
  public rotateXVelocity = new NumericProperty(
    'Rotate X Velocity',
    'Rotation',
    0,
    -10,
    10,
    0.7,
    0.1,
  );
  public rotateY = new NumericProperty('Rotate Y', 'Rotation', 0, -10, 10, 0.7, 0.1);
  public rotateYVelocity = new NumericProperty(
    'Rotate Y Velocity',
    'Rotation',
    0,
    -10,
    10,
    0.7,
    0.1,
  );
  public rotateZ = new NumericProperty('Rotate Z', 'Rotation', 0, -10, 10, 0.7, 0.1);
  public rotateZVelocity = new NumericProperty(
    'Rotate Z Velocity',
    'Rotation',
    0,
    -10,
    10,
    0.7,
    0.1,
  );

  public tunnelVelocity = new NumericProperty('Tunnel Velocity', 'Rotation', 0, -10, 10, 0.7, 0.1);

  /**
   *  Render Methods
   */

  private orbitAroundOrigin = ({ radius = 20, anglePos = 0, z = 0 }, sketch: p5) => {
    const x = radius * Math.sin(anglePos);
    const y = radius * Math.cos(anglePos);
    sketch.translate(x, y, z);
  };

  private createRotatingRing = (
    { radius = 20, pointSize = 20, pointsQty = 5, z = 0 },
    sketch: p5,
  ) => {
    const theta = sketch.radians(this.fanAmount.currentValue / pointsQty);

    for (let point = 0; point < pointsQty; point++) {
      sketch.push();
      const anglePos = theta * point + deltaRotation;
      this.orbitAroundOrigin({ radius, anglePos, z }, sketch);
      this.renderShape(sketch);
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
    deltaRotationX += this.rotateXVelocity.currentValue * 0.1;
    deltaRotationY += this.rotateYVelocity.currentValue * 0.1;
    deltaRotationZ += this.rotateZVelocity.currentValue * 0.1;
    deltaTunnel += this.tunnelVelocity.currentValue;
  };

  private readonly shapeSizeMap = {
    box: [ 1 ],
    sphere: [ 1 ],
    plane: [ 3.5, 1.5 ],
    torus: [ 1.2, 0.6 ],
    cylinder: [ 1, 2 ],
    cone: [ 1, 2 ],
    ellipsoid: [ 1, 2, 0.5 ],
  };

  private renderPrimitiveShape = (shape: WebglShape, shapeSize = 1, sketch: p5) => {
    const mappedDimensions = this.shapeSizeMap[ shape ].map((dimension: number) => shapeSize * dimension);
    sketch[ shape ](...mappedDimensions);
  };

  // <<<<<<< HEAD
  //   private renderCustomModel = async (shape = 'sphere', shapeSize = 1, sketch: p5) => {
  //     const modelPath = `${CUSTOM_MODELS_DIR}/${shape.toString()}.obj`;

  //     if (!sketch[ 'objects' ][ shape ]) {
  //       sketch[ 'objects' ][ shape ] = sketch.loadModel(modelPath, true);
  // =======
  private renderCustomModel = (shape: WebglShape, shapeSize = 1, sketch: p5) => {
    if (!sketch[ 'objects' ][ shape ]) {
      loadCustomModel(shape as CustomModelShape, sketch);
      // >>>>>>> 2e623f67975bc3c819f249b889504d9099408b5c
    }

    sketch.normalMaterial();
    sketch.scale(shapeSize * 0.025);
    sketch.model(sketch[ 'objects' ][ shape ]);
  };

  private renderShape = (sketch: p5) => {
    if (!sketch[ 'objects' ]) sketch[ 'objects' ] = {};

    const shapeSize = this.pointSize.currentValue;
    const shape = this.shape.currentValue as WebglShape;

    sketch.push();
    this.rotateShape(sketch);
    sketch.strokeWeight(0.5);

    if (typeof sketch[ shape ] === 'function') {
      // p5 primitive shapes
      this.renderPrimitiveShape(shape, shapeSize, sketch);
    } else {
      this.renderCustomModel(shape, shapeSize, sketch);
    }

    sketch.pop();
  };

  private rotateShape = (sketch: p5) => {
    const remapValue = 0.1;
    const angleX =
      deltaRotationX * this.rotateXVelocity.currentValue * remapValue + this.rotateX.currentValue;
    const angleY =
      deltaRotationY * this.rotateYVelocity.currentValue * remapValue + this.rotateY.currentValue;
    const angleZ =
      deltaRotationZ * this.rotateZVelocity.currentValue * remapValue + this.rotateZ.currentValue;

    sketch.rotateX(angleX);
    sketch.rotateY(angleY);
    sketch.rotateZ(angleZ);
  };

  private setColor = p5Helper.setColor;

  /**
   * Primary Render Function
   */
  public render(sketch: p5): void {
    const iterations = Math.floor(this.iterations.currentValue);
    const pointsQty = Math.floor(this.pointsQty.currentValue);
    const pointSize = this.pointSize.currentValue;
    const orbitRadius = this.orbitRadius.currentValue;
    const zDensity = this.zDepthDensity.currentValue;
    const zStep = this.zRange / zDensity / iterations;
    const cloneRotationOffset = this.cloneRotationOffset.currentValue;

    sketch.push();

    for (let i = 0; i < iterations; i++) {
      const iPos = this.zMax - i * zStep;
      const tunnelPos = deltaTunnel % this.zRange;
      const zPos = iPos + tunnelPos;
      const z = zPos > this.zMax ? zPos - this.zRange : zPos;

      sketch.rotateZ(sketch.radians(i * cloneRotationOffset));
      this.createRotatingRing({ radius: orbitRadius, pointSize, pointsQty, z }, sketch);
    }

    sketch.pop();

    this.updateRotationDelta();
  }
}
