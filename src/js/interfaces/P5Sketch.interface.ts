// Library Imports
import p5 from 'p5';
import { guidGenerator } from '../services/Utils';

// App Imports
import CatalogDataEntry from '../services/CatalogueDataEntry';
import easeInto from '../services/EasingService';
import NumericProperty from '../services/PropertyConstructorNumeric';
import VariableProperty from '../services/PropertyConstructorVariable';
import SketchCatalog from '../services/SketchCatalogue';

export interface P5Sketch {
  sid: string;
  windowWidth: number;
  windowHeight: number;
  catalogueInfo: CatalogDataEntry;
  bypass: boolean;

  sketchParameters: Array<NumericProperty | VariableProperty>;

  render(sketch: p5): void;
  easeInto(): void;
}

export class P5Base {
  public readonly sid: string;

  constructor() {
    this.sid = guidGenerator();
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

  public sketchParameters = [];
  public windowWidth: number;
  public windowHeight: number;
  public bypass = false;
  public catalogueInfo: CatalogDataEntry;
  public easeInto = easeInto;
}

export type P5Constructor = new () => P5Sketch;

