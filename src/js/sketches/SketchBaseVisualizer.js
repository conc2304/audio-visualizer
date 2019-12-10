/**
 *
 *    --  HERE ARE MY AMBITIONS - BEHOLD THEIR MULTITUDE!  --
 * TODO - make a toggle to spin/rotate the inner and outer waves like the 3D ones
 * TODO - make patterns by saving current config and make them triggerable (ie a pattern bank)
 * TODO - put controls into an iFrame
 * TODO - convert this entire thing into an web app (in progress)
 * TODO - loading animation
 *
 */

import RenderPolygon from '@/js/services/RenderPolygon';
import RegisteredSketches from '@/js/services/SketchRegistration';
import KeyboardControlsService from '@/js/services/KeyboardControlsService';


let audio;
let bgColor = 0;

const VisualizerSketch = p5 => {
  'use strict';

  // keep all 'custom' code here
  p5.preload = () => {
    p5.objects = {};
    p5.objects.lambo = p5.loadModel('./assets/webgl_models/lambo.obj', true);
    p5.objects.glock = p5.loadModel('./assets/webgl_models/glock.obj', true);
    p5.objects.dolphin = p5.loadModel('./assets/webgl_models/dolphin.obj', true);
    p5.objects.ducky = p5.loadModel('./assets/webgl_models/ducky.obj', true);
    p5.objects.satellite = p5.loadModel('./assets/webgl_models/satellite.obj', true);
    p5.objects.sword = p5.loadModel('./assets/webgl_models/sword.obj', true);
    p5.objects.whale = p5.loadModel('./assets/webgl_models/whale.obj', true);
    p5.objects.shuttle = p5.loadModel('./assets/webgl_models/shuttle.obj', true);

    p5.ctrlElementsArray = RegisteredSketches;
  };

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL);
    p5.polygon = RenderPolygon;
    p5.colorMode(p5.HSB);

    // make a method to retrieve the elements externally by the myp5 namespace
    for (let ctrlElement in p5.ctrlElementsArray) {
      if (!p5.ctrlElementsArray.hasOwnProperty(ctrlElement)) {
        continue;
      }
      let ctrlObjectName = p5.ctrlElementsArray[ctrlElement].constructor.name;
      p5[`get${ctrlObjectName}`] = () => p5.ctrlElementsArray[ctrlElement];
    }

    // p5setupPoseNet(p5);
  };

  p5.windowResized = () => {
    for (let ctrlElement in p5.ctrlElementsArray) {
      if (!p5.ctrlElementsArray.hasOwnProperty(ctrlElement)) {
        continue;
      }

      p5.ctrlElementsArray[ctrlElement].windowWidth = p5.windowWidth;
      p5.ctrlElementsArray[ctrlElement].waveWidth = p5.windowWidth + 200;
      p5.ctrlElementsArray[ctrlElement].windowHeight = p5.windowHeight;
    }

    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  let fftAnalysis = {};
  let tempObj;
  p5.draw = () => {
    p5.background(bgColor);

    // if (audio && audio.isLoaded() && !audio.isPaused()) {
    //   let seconds = Math.floor(audio.currentTime() % 60);
    //   let minutes = Math.floor(audio.currentTime() / 60);

    //   let time = ('0' + minutes).substr(-2) + ':' + ('0' + seconds).substr(-2);
    //   songTime.html(time);
    //   let downloadProgress = 100 * (audio.currentTime() / audio.duration())
    //   progressBar.val(downloadProgress);
    // }

    // fftAnalysis = getEQEnergy(fft);
    // applyAudioEnergyValues(fftAnalysis);

    KeyboardControlsService.playKeyboardKeys(p5);
    p5.keyReleased = () => {
      KeyboardControlsService.playPianoKey(p5.keyCode, false);
    };

    for (let ctrlElement in p5.ctrlElementsArray) {
      if (!p5.ctrlElementsArray.hasOwnProperty(ctrlElement)) {
        continue;
      }

      // don't render an object if we have made it not visible it
      if (p5.ctrlElementsArray[ctrlElement].bypass === true) {
        continue;
      }

      p5.ctrlElementsArray[ctrlElement].easeInto();
      p5.push();
      p5.ctrlElementsArray[ctrlElement].render(p5);
      p5.pop();
    }
  };
};

export default VisualizerSketch;


