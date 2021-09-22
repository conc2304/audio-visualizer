// Library Imports
import p5 from "p5";

// App Imports
import CatalogueInfoProperty from '../services/CatalogueDataEntry';

export default interface P5Sketch {
  sid: string;
  catalogueInfo: CatalogueInfoProperty;
  bypass: boolean;
  dynamicProps: Object;

  render(p5: p5, sketch: P5Sketch): void;
  easeInto(): void;

}
