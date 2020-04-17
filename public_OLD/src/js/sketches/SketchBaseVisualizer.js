/**
 *
 *    --  HERE ARE MY AMBITIONS - BEHOLD THEIR MULTITUDE!  --
 * TODO - make patterns by saving current config and make them triggerable (ie a pattern bank)
 * TODO - put controls into an iFrame
 * TODO - loading animation
 *
 */

import RenderPolygon from '@/js/services/RenderPolygon';
import RegisteredSketches from '@/js/services/SketchRegistration';
import KeyboardControlsService from '@/js/services/KeyboardControlsService';
import PoseNetService from '@/js/services/PoseNetService';

// keep all 'custom' code here
const VisualizerSketch = p5 => {
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

  let video;
  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL);
    p5.polygon = RenderPolygon;
    p5.colorMode(p5.HSB);

    // PoseNetService.initializeNet(p5);
  };

  p5.windowResized = () => {
    for (let ctrlElement in p5.ctrlElementsArray) {
      if (!p5.ctrlElementsArray.hasOwnProperty(ctrlElement)) {
        continue;
      }

      p5.ctrlElementsArray[ctrlElement].windowWidth = p5.windowWidth;
      p5.ctrlElementsArray[ctrlElement].windowHeight = p5.windowHeight;
      if (p5.ctrlElementsArray[ctrlElement].waveWidth) {
        p5.ctrlElementsArray[ctrlElement].waveWidth = p5.windowWidth + 200;
      }
    }

    if (PoseNetService.status === 'ready' ) {
      PoseNetService.appWidth = p5.windowWidth;
      PoseNetService.appHeight = p5.windowHeight;
      PoseNetService.imageSource.size(PoseNetService.appWidth, PoseNetService.appHeight);
    }

    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  p5.draw = () => {
    p5.background(0);

    if (PoseNetService.imageSource !== null && PoseNetService.imageSource.elt.readyState === 4) {
      if (PoseNetService.flipHorizontal === false) p5.scale(-1.0, 1.0); // flip x-axis backwards
      // p5.image(PoseNetService.imageSource, 0, 0, 100, 100);
      PoseNetService.getPose(p5);
    }

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

      if (p5.ctrlElementsArray[ctrlElement].easeInto) {
        p5.ctrlElementsArray[ctrlElement].easeInto();
      }

      p5.push();
      p5.ctrlElementsArray[ctrlElement].render(p5);
      p5.pop();
    }
  };
};

export default VisualizerSketch;
