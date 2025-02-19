// Sketches
import CenterWave from '@/js/sketches/p5/CenterOscillator.sketch';
import WEBGLWave from '@/js/sketches/p5/3DOscillator.sketch';
import OuterWaves from '@/js/sketches/p5/OuterOscillator.sketch';
import Parametric from '@/js/sketches/p5/ParametricCurve.sketch';
import Tunnel from '@/js/sketches/p5/Tunnel.sketch';
// import BodyBrush from '@/js/sketches/SketchConstructorBodyBrush'; TODO - FIX
import ParticleGrid from '../sketches/p5/ParticleGrid.sketch';
import { BaseSketch } from '../interfaces/P5Sketch.interface';
import RotaryTunnel from '../sketches/p5/RotaryTunnel.sketch';
import SketchCatalog from '@/js/services/SketchCatalogue';
import FlockingBoids from '@/js/sketches/three/boids/Flocking.sketch';

const RegisteredSketches: Array<BaseSketch> = [];

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
  new FlockingBoids(),
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
