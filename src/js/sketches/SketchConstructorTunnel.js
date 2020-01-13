import easeInto from '@/js/services/EasingService';
import Utils from '@/js/services/Utils';
import NumericProperty from '@/js/services/PropertyConstructorNumeric';
import VariableProperty from '@/js/services/PropertyConstructorVariable';
import CatalogueDataEntry from '@/js/services/CatalogueDataEntry';

import SketchCatalogue from '@/js/services/SketchCatalogue';

class Tunnel {
  constructor(windowWidth, windowHeight, p5) {
    this.sid =  Utils.guidGenerator();

    this.catalogueInfo = new CatalogueDataEntry(
      this.constructor,
      'Tunnel',
      'TEST',
      ['Parametric', 'Awesome'],
      'NOTNOTclyzby',
      './assets/sketch_catalogue_gifs/center-wave_200.gif',
      300,
      2,
    );

    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.origin = 0;
    this.bypass = false;

    this.radius = new NumericProperty('Size', 'Base', 20, 0, 2000, 0.7);

  }
}

Tunnel.prototype.render = function(p5) {
  p5.push();

  this.renderShape(p5, xPos, yPos, this.radius.currentValue, p5);

  p5.pop();


}
