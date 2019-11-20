import CenterWave from '@/js/sketches/SketchConstructorCenterWave';

const p5 = require('p5');
const registeredSketches = [];

registeredSketches.push(new CenterWave(window.innerWidth, window.innerHeight))

export default registeredSketches;
