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

let RegisteredSketches = store.getters.RegisteredSketches;

// keep all 'custom' code here
const VisualizerSketch = p5 => {
  p5.preload = () => {
    p5.objects = {};
  };

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL);
    p5.polygon = RenderPolygon;
    p5.colorMode(p5.HSB);
  };

  p5.windowResized = () => {
    for (let sketch in RegisteredSketches) {
      if (!RegisteredSketches.hasOwnProperty(sketch)) {
        continue;
      }

      RegisteredSketches[sketch].windowWidth = p5.windowWidth;
      RegisteredSketches[sketch].windowHeight = p5.windowHeight;
      if (RegisteredSketches[sketch].waveWidth) {
        RegisteredSketches[sketch].waveWidth = p5.windowWidth + 200;
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
    try {
      RegisteredSketches = store.getters.RegisteredSketches;
      if (p5.frameCount % 120 === 0) console.log(RegisteredSketches);

      p5.background(0);

      if (PoseNetService?.imageSource?.elt?.readyState === 4) {
        if (!PoseNetService.flipHorizontal) p5.scale(-1.0, 1.0); // flip x-axis backwards

        PoseNetService.getPose(p5);
      }

      KeyboardControlsService.playKeyboardKeys(p5);
      p5.keyReleased = () => {
        KeyboardControlsService.playPianoKey(p5.keyCode, false);
      };

      for (let sketch of RegisteredSketches) {
        // don't render an object if we have made it not visible it
        if (sketch?.shape && p5.frameCount % 60 === 0) {
          // console.log(`${sketch.shape.currentValue}`);
        }

        if (!sketch.render) {
          throw new Error('No render() available on sketch', sketch);
        }

        if (p5.frameCount % 120 === 0) {
          console.log(0, 'here');
          console.log(RegisteredSketches);
          console.log(sketch);
        }

        if (sketch?.bypass) continue;

        if (sketch?.easeInto) {
          sketch.easeInto.apply(sketch);
        }

        p5.push();
        sketch.render(p5);
        p5.pop();
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export default VisualizerSketch;
