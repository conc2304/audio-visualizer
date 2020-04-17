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
      'Infinite Tunnel',
      'A generative never ending tunnel ',
      ['Generative', 'Tunnel', 'Loop'],
      'StillClyzby',
      './assets/sketch_catalogue_gifs/tunnel_200.gif',
      202,
      1,
    );

    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.origin = 0;
    this.bypass = false;

    this.zMax = 900;
    this.zMin = -6000;
    this.zDist = this.zMax - this.zMin;
    this.zPos = this.zMin;

    this.radius = new NumericProperty('Size', 'Base', 20, 0, 2000, 0.7);
    this.strokeWeight = new NumericProperty('Line Width', 'Base', 2, 2, 200, 0.7);

    this.iterations = new NumericProperty('Number of Objects', 'Base', 3, 0, 40, 0.5);
    // this.spacing = new NumericProperty('Z Spacing', 'Base', 3, -100, 500, 0.5);
    this.tunnelSpeed = new NumericProperty('Speed', 'Base', 3, -50, 100, 0.5);
    // this.secondaryColorSpeed = new NumericProperty('Tunnel Color Speed', 'Color', 2, -3, 4, 0.7);
    this.shape = new VariableProperty('Shape', 'Base', 'square', [
      'line',
      'triangle',
      'square',
      'pentagon',
      'ellipse',
    ]);

    this.translateX = new NumericProperty('Translate X', 'Position', 0, -900, 900, 0.7);
    this.translateY = new NumericProperty('Translate Y', 'Position', 0, -900, 900, 0.7);
    // this.translateZ = new NumericProperty('Translate Z', 'Position', 0, -900, 900, 0.7);

    this.hue = new NumericProperty('Color', 'Color', 200, 0, 360, 0.1);
    this.saturation = new NumericProperty('Saturation', 'Color', 100, 0, 100, 0.1);
  }
}

let tunnelPos;

Tunnel.prototype.render = function(p5) {
  p5.push();

  const frame = p5.frameCount;
  const zStep = this.zDist / this.iterations.currentValue;
  const tunnelPos = (frame * this.tunnelSpeed.currentValue) % this.zDist;

  p5.noFill();

  for (let i = 0; i < this.iterations.currentValue; i++) {
    p5.push();

    // make it restart from the minimum on loop
    const zToSet = this.zMin + tunnelPos + i * zStep;
    this.zPos = zToSet > this.zMax ? zToSet - this.zDist : zToSet;

    p5.translate(this.translateX.currentValue, this.translateY.currentValue, this.zPos);

    p5.strokeWeight(this.strokeWeight.currentValue);
    const calc = p5.sin(p5.noise((frame + 2.5 * i) * 0.01));
    const wave = p5.map(calc, 0, 1, 0, 100);
    const hue = p5.map(calc, 0, 1, Number(this.hue.min), Number(this.hue.max));
    const saturation = p5.map(calc, 0, 1, Number(this.saturation.min), Number(this.saturation.max));

    if (i % 7 == 0) {
      p5.stroke(360 - this.hue.currentValue, saturation, 100);
    } else {
      p5.stroke(hue, this.saturation.currentValue, wave);
    }

    let noiseXAmplitude = 1;
    let noiseYAmplitude = 1;
    let noiseXSpeed = 0.001;
    let noiseYSpeed = 0.001;

    const noiseX = p5.map(p5.noise((frame + i) * 0.01) * noiseXAmplitude, 0, 1, -this.windowWidth / 2, this.windowWidth / 2 );
    const noiseY = p5.map(p5.noise(frame * noiseYSpeed * i) * noiseYAmplitude, 0, 1, -this.windowHeight / 2, this.windowHeight / 2 );
    // p5.translate(noiseX,  noiseY, 0);

    this.renderShape(p5, 0, 0, this.radius.currentValue);
    p5.pop();
  }
  p5.pop();
};

Tunnel.prototype.rotateShape = helper.rotateShape;
Tunnel.prototype.setColor = helper.setColor;
Tunnel.prototype.renderShape = helper.renderShape;
Tunnel.prototype.easeInto = easeInto;

export default Tunnel;
