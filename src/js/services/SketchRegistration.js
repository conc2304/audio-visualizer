import SketchCatalogue from '@/js/services/SketchCatalogue';

import CenterWave from '@/js/sketches/SketchConstructorCenterWave';
import WEBGLWave from  '@/js/sketches/SketchConstructorWEBGLWave';
import OuterWaves from '@/js/sketches/SketchConstructorOuterWaves';
import Parametric from '@/js/sketches/SketchConstructorParametric';
import Tunnel from '@/js/sketches/SketchConstructorTunnel';
import BodyBrush from '@/js/sketches/SketchConstructorBodyBrush';

const registeredSketches = [];

SketchCatalogue.push(new CenterWave(window.innerWidth, window.innerHeight));
SketchCatalogue.push(new OuterWaves(window.innerWidth, window.innerHeight));
SketchCatalogue.push(new WEBGLWave(window.innerWidth, window.innerHeight));
SketchCatalogue.push(new Parametric(window.innerWidth, window.innerHeight));
SketchCatalogue.push(new Tunnel(window.innerWidth, window.innerHeight));
SketchCatalogue.push(new BodyBrush(window.innerWidth, window.innerHeight));


let i = 0;
// start them with 3 of the sketches
while (i < 3) {
  if (!SketchCatalogue[i]) {
    break;
  }

  const catalogueItem = SketchCatalogue[i].catalogueInfo;
  const sketch = new catalogueItem.classConstructor(window.innerWidth, window.innerHeight);
  registeredSketches[sketch.sid] = sketch;
  i++;
}


console.log(registeredSketches);
console.log(registeredSketches.length);

export default registeredSketches;
