import CenterWave from '@/js/sketches/SketchConstructorCenterWave';
import WEBGLWave from '@/js/sketches/SketchConstructorWEBGLWave';
import OuterWaves from '../sketches/SketchConstructorOuterWaves';

const registeredSketches = [];

registeredSketches.push(new CenterWave(window.innerWidth, window.innerHeight));
registeredSketches.push(new OuterWaves(window.innerWidth, window.innerHeight));
registeredSketches.push(new WEBGLWave(window.innerWidth, window.innerHeight));

export default registeredSketches;
