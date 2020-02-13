import easeInto from '@/js/services/EasingService';
import helper from '@/js/services/p5Helper.js';
import Utils from '@/js/services/Utils';
import NumericProperty from '@/js/services/PropertyConstructorNumeric';
import VariableProperty from '@/js/services/PropertyConstructorVariable';
import CatalogueDataEntry from '@/js/services/CatalogueDataEntry';
import PoseNetService from '@/js/services/PoseNetService.js';
import SketchCatalogue from '@/js/services/SketchCatalogue';

class BodyBrush {
  constructor(windowWidth, windowHeight, p5) {
    this.sid = Utils.guidGenerator();

    this.catalogueInfo = new CatalogueDataEntry(
      this.constructor,
      'Body Brush',
      'Kinetic art meets your computer, dance around and become a digital brush',
      ['Body Tracking', 'Web Cam', 'Interactive'],
      'NOTNOTclyzby',
      './assets/sketch_catalogue_gifs/center-wave_200.gif',
      300,
      2,
    );

    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.easeInto = easeInto;
    this.history = [];
    this.bypass = false;

    this.radius = new NumericProperty('Size', 'Base', 20, -1000, 2000, 0.7);

    this.shape = new VariableProperty('Shape', 'Base', 'ellipse', [
      'line',
      'triangle',
      'square',
      'pentagon',
      'ellipse',
    ]);

    this.hue = new NumericProperty('Color', 'Color', 200, 0, 360, 0.1);
    this.saturation = new NumericProperty('Saturation', 'Color', 100, 0, 100, 0.1);
  }
}

BodyBrush.prototype.render = function(p5) {
  // We can call both functions to draw all keypoints and the skeletons

  if (PoseNetService.imageSource === null || PoseNetService.imageSource.elt.readyState !== 4) {
    return;
  }

  // this.history.unshift(pose);
  // this.history = this.history.slice(0, 30);

  this.drawKeyPoints(p5);
};

BodyBrush.prototype.drawKeyPoints = function(p5) {
  // Loop through all the poses detected
  if (!PoseNetService.poseCoords) {
    return;
  }

  const poses = PoseNetService.poseCoords;

  // multiple poses
  if (typeof poses === 'array') {
    for (let i = 0; i < poses.length; i++) {
      const pose = poses[i].pose;
      this.renderPose(p5, pose);
    }
  }
  // single pose
  else if (typeof poses === 'object') {
    this.renderPose(p5, poses);
  }
};

BodyBrush.prototype.renderPose = function(p5, pose) {
  p5.noFill();
  p5.strokeWeight(3);
  p5.stroke(this.hue.currentValue, this.saturation.currentValue, 100);

  console.log(pose);

  if (!pose.keypoints) return;
  this.renderPosePoints(p5, pose);

  // NOTE this version doesnt seem to have skeleton points
  // if (this.renderSkeleton.currentValue === true) {
  //   this.renderSkeleton(p5, pose);
  // }
};


BodyBrush.prototype.renderPosePoints = function(p5, pose) {
  for (let i = 0; i < pose.keypoints.length; i++) {
    // A keyPoint is an object describing a body part (like rightArm or leftShoulder)
    let keyPoint = pose.keypoints[i];
    if (keyPoint.score > 0.2) {
      this.renderShape(
        p5,
        keyPoint.position.x - this.windowWidth / 4,
        keyPoint.position.y - this.windowHeight / 4,
        this.radius.currentValue,
      );
    }
  }
}


BodyBrush.prototype.renderSkeleton = function(p5, pose) {
  // Loop through all the skeletons detected
  if (!poses || !pose.skeleton) {
    return;
  }

  for (let j = 0; j < skeleton.length; j++) {
    const partA = skeleton[j][0];
    const partB = skeleton[j][1];
    p5.stroke(this.hue.currentValue, this.saturation.currentValue, 100);
    p5.stroke(0, this.saturation.currentValue, 100);
    p5.strokeWeight(8);
    p5.line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
  }
};

BodyBrush.prototype.drawTrailers = function(p5) {
  this.history = this.history.slice(0, this.trailLength.currentValue);
  const historyLength = this.history.length;

  for (let i = 0; i < historyLength; i++) {
    const percent = (historyLength - (i + 1)) / historyLength;
    const rotationAmount = p5.map(percent, 0, 1, 0, 100);
    const pose = this.history[i];
    const tempHue = this.hue.currentValue;

    const hue = this.colorRotate === true ? (tempHue + rotationAmount) % 360 : tempHue;

    p5.noFill();
    p5.strokeWeight(3);
    p5.stroke(hue, this.saturation.currentValue, rotationAmount);
    this.renderPose(pose);
  }
};

BodyBrush.prototype.calculateAverage = function() {
  this.history.unshift(pose);

}

BodyBrush.prototype.setColor = helper.setColor;
BodyBrush.prototype.renderShape = helper.renderShape;
BodyBrush.prototype.easeInto = easeInto;

export default BodyBrush;
