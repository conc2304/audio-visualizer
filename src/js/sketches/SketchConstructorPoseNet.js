import easeInto from '@/js/services/EasingService';
import helper from '@/js/services/p5Helper.js';
import Utils from '@/js/services/Utils';
import NumericProperty from '@/js/services/PropertyConstructorNumeric';
import VariableProperty from '@/js/services/PropertyConstructorVariable';
import CatalogueDataEntry from '@/js/services/CatalogueDataEntry';

import SketchCatalogue from '@/js/services/SketchCatalogue';


class PoseNet {
  constructor(windowWidth, windowHeight, p5) {
    this.sid =  Utils.guidGenerator();

    this.catalogueInfo = new CatalogueDataEntry(
      this.constructor,
      'Basic Sine Wave',
      'A simple parametric sine wave with various shapes as point along the wave.',
      ['Parametric', 'Awesome'],
      'NOTNOTclyzby',
      './assets/sketch_catalogue_gifs/center-wave_200.gif',
      300,
      2,
    );

    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.easeInto = easeInto;
    this.history = [];
    this.colorRotate = true;
    this.bypass = true;

  }
}


PoseDetector.prototype.render = function (p5) {
  // We can call both functions to draw all keypoints and the skeletons



  this.drawKeypoints(p5);
};


PoseDetector.prototype.drawKeypoints = function (p5) {
  // Loop through all the poses detected
  if (!poses) {
    return;
  }

  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    this.history.unshift(pose);
    p5.noFill();
    p5.strokeWeight(3);
    p5.stroke(this.hue.currentValue, this.saturation.currentValue, 100);
    this.renderPose(p5, pose);
  }
};

PoseDetector.prototype.renderPose = function (pose) {
  for (let j = 0; j < pose.keypoints.length; j++) {
    // A keypoint is an object describing a body part (like rightArm or leftShoulder)
    let keypoint = pose.keypoints[j];
    if (keypoint.score > 0.2) {

      this.renderShape(
        p5,
        keypoint.position.x - this.windowWidth / 2,
        keypoint.position.y - this.windowHeight / 2,
        this.radius.currentValue
      );
    }
  }
};

PoseNet.prototype.setColor = helper.setColor;
PoseNet.prototype.renderShape = helper.renderShape;
PoseNet.prototype.easeInto = easeInto;

export default PoseNet;
