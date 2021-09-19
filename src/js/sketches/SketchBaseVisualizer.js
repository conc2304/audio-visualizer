/**
 *
 *    --  HERE ARE MY AMBITIONS - BEHOLD THEIR MULTITUDE!  --
 * TODO - make patterns by saving current config and make them triggerable (ie a pattern bank)
 * TODO - put controls into an iFrame
 * TODO - loading animation
 *
 */

import RenderPolygon from '@/js/services/RenderPolygon';
import KeyboardControlsService from '@/js/services/KeyboardControlsService';
import PoseNetService from '@/js/services/PoseNetService';
import store from '../../store';

// keep all 'custom' code here
const VisualizerSketch = p5 => {
  p5.preload = () => {
    p5.objects = {};
    const RegisteredSketches = store.getters.RegisteredSketches;
    p5.ctrlElementsArray = RegisteredSketches;
  };

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL);
    p5.polygon = RenderPolygon;
    p5.colorMode(p5.HSB);
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

    if (PoseNetService.status === 'ready') {
      PoseNetService.appWidth = p5.windowWidth;
      PoseNetService.appHeight = p5.windowHeight;
      PoseNetService.imageSource.size(
        PoseNetService.appWidth,
        PoseNetService.appHeight,
      );
    }

    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  p5.draw = () => {
    const RegisteredSketches = store.getters.RegisteredSketches;

    p5.background(0);

    if (
      PoseNetService.imageSource !== null &&
      PoseNetService.imageSource.elt.readyState === 4
    ) {
      if (PoseNetService.flipHorizontal === false) p5.scale(-1.0, 1.0); // flip x-axis backwards
      PoseNetService.getPose(p5);
    }

    KeyboardControlsService.playKeyboardKeys(p5);
    p5.keyReleased = () => {
      KeyboardControlsService.playPianoKey(p5.keyCode, false);
    };

    for (let sketchItem in RegisteredSketches) {
      if (!RegisteredSketches.hasOwnProperty(sketchItem)) {
        continue;
      }

      // don't render an object if we have made it not visible it
      if (RegisteredSketches[sketchItem].bypass === true) {
        continue;
      }

      if (RegisteredSketches[sketchItem].easeInto) {
        RegisteredSketches[sketchItem].easeInto();
      }

      p5.push();
      RegisteredSketches[sketchItem].render(p5);
      p5.pop();
    }
  };
};

export default VisualizerSketch;
