import p5 from 'p5';
import { P5Base } from '../interfaces/P5Sketch.interface';
import easeInto from '../services/EasingService';
import CatalogueDataEntry from '../services/CatalogueDataEntry';
import NumericProperty from '../services/PropertyConstructorNumeric';
import VariableProperty from '../services/PropertyConstructorVariable';
import p5Helper from '../services/p5Helper';
// import { P5_PRIMITIVES_3D, WEBGL_MODELS } from '../constants';

export default class RotaryTunnel extends P5Base {
  constructor() {
    super();
  }

  public catalogueInfo = new CatalogueDataEntry(
    this,
    'Perlin Noise',
    'Flow Field',
    ['Noise', 'Generative', 'Flow Fields'],
    'clyzby',
    'rotary-tunnel_200.gif',
    300,
    8,
    '2021-12-02',
  );

  /**
   * Sketch Parameters
   * */

  public orbitRadius = new NumericProperty('Orbit Radius', 'Base', 200, 5, 500, 0.7, 1);

  /**
   *  Render Methods
   */

  public easeInto = easeInto;

  /**
   * Primary Render Function
   */
  public render(sketch: p5): void {}
}
