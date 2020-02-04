import easeInto from '@/js/services/EasingService';
import Utils from '@/js/services/Utils';
import helper from '@/js/services/p5Helper.js';

import NumericProperty from '@/js/services/PropertyConstructorNumeric';
import VariableProperty from '@/js/services/PropertyConstructorVariable';
import CatalogueDataEntry from '@/js/services/CatalogueDataEntry';
import SketchCatalogue from '@/js/services/SketchCatalogue';

class Tunnel {
  constructor(windowWidth, windowHeight, p5) {
    this.sid = Utils.guidGenerator();

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

    this.iterations = new NumericProperty('Number of Objects', 'Base', 3, 0, 40, 0.5);
    this.spacing = new NumericProperty('Z Spacing', 'Base', 3, -100, 500, 0.5);

    this.shape = new VariableProperty('Shape', 'Base', 'square', [
      'line',
      'triangle',
      'square',
      'pentagon',
      'ellipse',
    ]);

    this.translateX = new NumericProperty('Translate X', 'Position', 0, -900, 900, 0.7);
    this.translateY = new NumericProperty('Translate Y', 'Position', 0, -900, 900, 0.7);
    this.translateZ = new NumericProperty('Translate Z', 'Position', 0, -900, 900, 0.7);

    this.hue = new NumericProperty('Color', 'Color', 200, 0, 360, 0.1);
    this.saturation = new NumericProperty('Saturation', 'Color', 100, 0, 100, 0.1);
  }
}

Tunnel.prototype.render = function(p5) {
  p5.push();

  let xPos = 0;
  let yPos = 0;

  p5.strokeWeight(2);
  // p5.stroke(this.hue.currentValue, this.saturation.currentValue, 100);
  // p5.fill(360, 180, 10);

  p5.noFill();

  let i = 0;
  while (i < this.iterations.currentValue) {
    p5.push();

    const depth = i * this.spacing.currentValue;
    const movement = -p5.sin(p5.frameCount * 0.001) * 500;
    const radius = this.radius.currentValue;
    const test = p5.map(p5.sin(p5.frameCount * 0.005 + i), 0, 1, 0, 360);

    p5.translate(
      this.translateX.currentValue,
      this.translateY.currentValue,
      this.translateZ.currentValue + 200 - i * this.spacing.currentValue + movement,
    );


    if (i === 0) {
      p5.stroke(360, this.saturation.currentValue, 100);
    } else {
      const calc = p5.sin(p5.noise((p5.frameCount + ( 2.5 * i) ) * 0.1 ));
      const wave = p5.map(calc, 0, 1, 0, 100);
      const hue = p5.map(calc, 0, 1, Number(this.hue.min), Number(this.hue.max));
      console.log(hue);
      p5.stroke(hue, this.saturation.currentValue, wave);
    }

    this.renderShape(p5, xPos, yPos, radius);
    p5.pop();

    i++;
  }

  p5.pop();
};

Tunnel.prototype.rotateShape = helper.rotateShape;
Tunnel.prototype.setColor = helper.setColor;
Tunnel.prototype.renderShape = helper.renderShape;
Tunnel.prototype.easeInto = easeInto;

export default Tunnel;
