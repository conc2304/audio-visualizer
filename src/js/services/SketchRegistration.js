import SketchCatalogue from '@/js/services/SketchCatalogue';

import CenterWave from '@/js/sketches/SketchConstructorCenterWave';
import WEBGLWave from  '@/js/sketches/SketchConstructorWEBGLWave';
import OuterWaves from '@/js/sketches/SketchConstructorOuterWaves';

const registeredSketches = [];

SketchCatalogue.push(new CenterWave(window.innerWidth, window.innerHeight));
SketchCatalogue.push(new OuterWaves(window.innerWidth, window.innerHeight));
SketchCatalogue.push(new WEBGLWave(window.innerWidth, window.innerHeight));

let i = 0;
// start them with 3 of the sketches
while (i < 3) {
  let catalogueItem = SketchCatalogue[i].catalogueInfo;
  registeredSketches.push(new catalogueItem.classConstructor(window.innerWidth, window.innerHeight));
  i++;
}


export default registeredSketches;
