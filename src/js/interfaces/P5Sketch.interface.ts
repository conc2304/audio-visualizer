// Library Imports
import p5 from "p5";

// App Imports
import CatalogueInfoProperty from '../services/CatalogueDataEntry';

export default interface P5Sketch {
  sid: string;
  catalogueInfo: CatalogueInfoProperty;

  render(sketch: p5): void;
  easeInto(): void;
}
