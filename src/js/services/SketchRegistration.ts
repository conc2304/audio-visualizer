// Sketches
import CenterWave from '@/js/sketches/CenterOscillator.sketch';
import WEBGLWave from '@/js/sketches/3DOscillator.sketch';
import OuterWaves from '@/js/sketches/OuterOscillator.sketch';
import Parametric from '@/js/sketches/ParametricCurve.sketch';
import Tunnel from '@/js/sketches/Tunnel.sketch';
// import BodyBrush from '@/js/sketches/SketchConstructorBodyBrush'; TODO - FIX
import ParticleGrid from '../sketches/ParticleGrid.sketch';
import { P5Sketch } from '../interfaces/P5Sketch.interface';
import RotaryTunnel from '../sketches/RotaryTunnel.sketch';
import SketchCatalog from '@/js/services/SketchCatalogue';

const RegisteredSketches: Array<P5Sketch> = [];

// load all sketches into the catalog
// todo - make each file register itself somehow
SketchCatalog.push(
  new CenterWave(),
  new OuterWaves(),
  new WEBGLWave(),
  new Parametric(),
  new Tunnel(),
  new ParticleGrid(),
  new RotaryTunnel(),
  // new BodyBrush(), // todo - broken
);

let i = 0;
// start them with 3 of the sketches
while (i < 3) {
  if (!SketchCatalog[i]) break;

  const { classConstructor } = SketchCatalog[i].catalogueInfo;
  const newSketch = new classConstructor();
  RegisteredSketches.push(newSketch);
  i++;
}

export default RegisteredSketches;
