import SketchCatalogue from '@/js/services/SketchCatalogue';

import CenterWave from '@/js/sketches/SketchConstructorCenterWave';
import WEBGLWave from '@/js/sketches/SketchConstructorWEBGLWave';
import OuterWaves from '@/js/sketches/SketchConstructorOuterWaves';
import Parametric from '@/js/sketches/SketchConstructorParametric';
import Tunnel from '@/js/sketches/SketchConstructorTunnel';
import BodyBrush from '@/js/sketches/SketchConstructorBodyBrush';
import ParticleGrid from '../sketches/ParticleGrid.sketch';
import RotaryTunnel from '../sketches/RotaryTunnel.sketch';

const RegisteredSketches: Array<any> = [];

// SketchCatalogue.push(new CenterWave(window.innerWidth, window.innerHeight));
// SketchCatalogue.push(new OuterWaves(window.innerWidth, window.innerHeight));
// SketchCatalogue.push(new WEBGLWave(window.innerWidth, window.innerHeight));
// SketchCatalogue.push(new Parametric(window.innerWidth, window.innerHeight));
// SketchCatalogue.push(new Tunnel(window.innerWidth, window.innerHeight));
// SketchCatalogue.push(new BodyBrush(window.innerWidth, window.innerHeight));
// SketchCatalogue.push(new ParticleGrid(window.innerWidth, window.innerHeight));
SketchCatalogue.push(new RotaryTunnel(window.innerWidth, window.innerHeight));


let i = 0;
// start them with 3 of the sketches
while (i < 3) {
  if (!SketchCatalogue[ i ]) {
    break;
  }

  const catalogueItem = SketchCatalogue[ i ].catalogueInfo;
  RegisteredSketches.push(new catalogueItem.classConstructor(window.innerWidth, window.innerHeight));
  i++;
}

export default RegisteredSketches;
