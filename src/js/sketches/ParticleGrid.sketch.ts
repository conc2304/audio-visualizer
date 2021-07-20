
import Utils from '@/js/services/Utils';

import NumericProperty from '@/js/services/PropertyConstructorNumeric';
import VariableProperty from '@/js/services/PropertyConstructorVariable';
import CatalogueDataEntry from '@/js/services/CatalogueDataEntry';
import p5 from 'p5';

export default class ParametricGrid {
  constructor (
    public windowWidth: number,
    public windowHeight: number,
    public sketch: p5) {
    this.catalogueInfo = new CatalogueDataEntry(
      this.constructor,
      'Infinite Tunnel',
      'A generative never ending tunnel ',
      [ 'Generative', 'Tunnel', 'Loop' ],
      'StillClyzby',
      './assets/sketch_catalogue_gifs/tunnel_200.gif',
      202,
      1,
    );
  }
  public catalogueInfo: CatalogueDataEntry;
  public sid = Utils.guidGenerator();


};
