import easeInto from '@/js/services/EasingService';
import helper from '@/js/services/p5Helper.js';
import Utils from '@/js/services/Utils';
import NumericProperty from '@/js/services/PropertyConstructorNumeric';
import VariableProperty from '@/js/services/PropertyConstructorVariable';
import CatalogueDataEntry from '@/js/services/CatalogueDataEntry';
import PoseNetService from '@/js/services/PoseNetService.js';
import SketchCatalogue from '@/js/services/SketchCatalogue';

import Particle from '@/js/sketches/SketchContstructorParticleBrush.js';
import { PoseNet } from '@tensorflow-models/posenet';

class BodyBrush {
  constructor(windowWidth, windowHeight, p5) {
    this.sid = Utils.guidGenerator();

    this.catalogueInfo = new CatalogueDataEntry(
      this.constructor,
      'Body Brush',
      'Kinetic art meets your computer, dance around and become a digital brush',
      ['Body Tracking', 'Web Cam', 'Interactive', 'Particle System'],
      'clyzby',
      './assets/sketch_catalogue_gifs/body-brush_200.gif',
      400,
      5,
    );

    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.easeInto = easeInto;

    this.historicPoint = {};

    this.limbsToTrack = [
      'nose',
      'rightWrist',
      'rightElbow',
      'leftElbow',
      'leftWrist',
      'rightAnkle',
      'leftAnkle',
      'leftHip',
      'rightHip',
    ];
    // this.limbsToTrack = ['rightWrist', 'leftWrist', 'rightAnkle', 'leftAnkle', 'nose'];
    // this.limbsToTrack = ['rightWrist', 'leftWrist', 'nose'];
    // this.limbsToTrack = ['rightWrist', 'leftWrist'];

    this.bypass = false;

    this.particleQty = 1000;
    this.particleBodies = [];

    this.shiftX = windowWidth * 0.5;
    this.shiftY = windowHeight * 0.5;

    this.radius = new NumericProperty('Size', 'Base', 20, -1000, 2000, 0.7);

    this.gravity = new NumericProperty('Gravity', 'Base', 50, 0.1, 10, 0.7);
    this.drag = new NumericProperty('Drag', 'Base', 50, 1, 100, 0.7);
    this.wDelta = new NumericProperty('T Hold?', 'Base', 50, 1, 100, 0.7);
    this.gravityOn = new VariableProperty('Gravity On', 'Base', 'off', ['on', 'off']);

    this.shape = new VariableProperty('Show Key Point', 'Base', 'off', ['off', 'ellipse']);

    this.hue = new NumericProperty('Color', 'Color', 200, 0, 360, 0.7);
    this.strokeWeight = new NumericProperty('Line Width', 'Base', 1, 1, 50, 0.7);
    this.saturation = new NumericProperty('Saturation', 'Color', 100, 0, 100, 0.17);
  }
}

BodyBrush.prototype.render = function(p5) {
  // post app init posenet initialization
  if (PoseNetService.status === 'uninitialized') {
    PoseNetService.initializeNet(p5);
  }

  if (this.particleBodies.length === 0) {
    let groupSize = this.particleQty / this.limbsToTrack.length;

    for (let partIndex = 0; partIndex < this.limbsToTrack.length; partIndex++) {
      let targetPartName = this.limbsToTrack[partIndex];
      let temp = [];
      while (temp.length < groupSize) {
        temp.push(new Particle(p5, targetPartName));
      }

      this.particleBodies = [...temp, ...this.particleBodies];
    }
  }
  // end posenet init

  if (
    PoseNetService.imageSource === null ||
    PoseNetService.imageSource.elt.readyState !== 4 ||
    PoseNetService.status !== 'ready'
  ) {
    return;
  }

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
    // just do one pose for now
    this.renderPose(p5, poses[0]);

    // for (let i = 0; i < poses.length; i++) {
    //   const pose = poses[i].pose;
    //   this.renderPose(p5, pose);
    // }
  }
  // single pose
  else if (typeof poses === 'object') {
    this.renderPose(p5, poses);
  }
};

BodyBrush.prototype.renderPose = function(p5, pose) {
  // console.log(pose);

  if (!pose.keypoints) return;
  if (this.shape.currentValue !== 'off') {
    p5.noFill();
    p5.strokeWeight(3);
    p5.stroke(this.hue.currentValue, this.saturation.currentValue, 100);
    this.renderPosePoints(p5, pose);
  }

  p5.strokeWeight(this.strokeWeight.currentValue);
  p5.stroke(this.hue.currentValue, this.saturation.currentValue, 100);
  p5.fill(this.hue.currentValue, this.saturation.currentValue, 100);
  this.renderParticleBrush(p5, pose);
  p5.noFill();

  // NOTE this version doesn't seem to have skeleton points
  // if (this.renderSkeleton.currentValue === true) {
  //   this.renderSkeleton(p5, pose);
  // }
};

const thresholdPercent = 0.3;
const threshold = {
  x: PoseNetService.appWidth * thresholdPercent,
  y: PoseNetService.appHeight * thresholdPercent,
};
BodyBrush.prototype.renderParticleBrush = function(p5, pose) {
  for (let particleI = 1; particleI < this.particleBodies.length + 1; particleI++) {
    let particle = this.particleBodies[particleI - 1];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let keyPoint = pose.keypoints[i];

      if (particle.targetPartName === keyPoint.part) {
        this.applyControllerValues(p5, particle);

        // // to avoid the glitchy bouncing/flickering of position points
        // // if position x or y is more than our threshold away in distance
        // // then use the last know location
        // THIS DIDNT WORK
        // if (this.historicPoint[keyPoint.part]) {
        //   let distance = pointDistance(
        //     keyPoint.position.x,
        //     keyPoint.position.y,
        //     this.historicPoint[keyPoint.part].x,
        //     this.historicPoint[keyPoint.part].y,
        //   );

        //   // console.log(distance, threshold.x, threshold.y);

        //   if (distance > threshold.x || distance > threshold.y) {
        //     console.warn('threshold reached');
        //     keyPoint.position = {
        //       x: this.historicPoint[keyPoint.part].x,
        //       y: this.historicPoint[keyPoint.part].y,
        //     };
        //   }
        // }

        particle.gravityOn = this.gravityOn.currentValue === 'on' ? true : false;

        if (particle.targetPartName === 'nose') {
          // particle.gravityOn = true;
          // particle.gravity = 1000;
        }

        particle.render(
          keyPoint.position.x - this.windowWidth / 2,
          keyPoint.position.y - this.windowHeight / 2,
        );

        p5.ellipse(
          keyPoint.position.x - this.windowWidth / 2,
          keyPoint.position.y - this.windowHeight / 2,
          4,
          4,
        );

        this.historicPoint[keyPoint.part] = keyPoint.position;
      }
    }
  }
};

BodyBrush.prototype.renderPosePoints = function(p5, pose) {
  for (let i = 0; i < pose.keypoints.length; i++) {
    // A keyPoint is an object describing a body part (like rightArm or leftShoulder)
    let keyPoint = pose.keypoints[i];

    if (!this.limbsToTrack.includes(keyPoint.part)) continue;
    if (keyPoint.score > 0.1) {
      this.renderShape(
        p5,
        keyPoint.position.x - this.windowWidth / 2,
        keyPoint.position.y - this.windowHeight / 2,
        this.radius.currentValue,
      );
    }
  }
};

BodyBrush.prototype.applyControllerValues = function(p5, particle) {
  particle.gravity = p5.map(
    this.gravity.currentValue,
    this.gravity.defaultMin,
    this.gravity.defaultMax,
    1,
    100000,
  );
  particle.drag = p5.map(
    this.drag.currentValue,
    this.drag.defaultMin,
    this.drag.defaultMax,
    0.00005,
    0.005,
  );
  particle.wDelta = p5.map(
    this.wDelta.currentValue,
    this.wDelta.defaultMin,
    this.wDelta.defaultMax,
    -100,
    200,
  );
};

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

// calculate the average of each saved pose by body part
BodyBrush.prototype.calculateAverage = function() {
  // add them all up
  let avgKeyPoints = {};
  for (let pose of this.history) {
    for (let kP of pose) {
      if (!avgPosePart[hPose.part]) {
        avgKeyPoints[hPose.part] = {};
      }
    }
  }
};

/**
 * Calculate Euclidean distance between points
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} z1
 * @param {Number} z2
 */
function pointDistance(x1, y1, x2, y2, z1 = 0, z2 = 0) {
  const a = x2 - x1;
  const b = y2 - y1;
  const c = z2 - z1;

  const distance = Math.sqrt(a * a + b * b + c * c);

  return distance;
  // let v1 = p5.createVector(x1, y1, z1);
  // let v2 = p5.createVector(x2, y2, z2);

  // return (distance = p5.Vector.dist(v1, v2));
}

BodyBrush.prototype.setColor = helper.setColor;
BodyBrush.prototype.renderShape = helper.renderShape;
BodyBrush.prototype.easeInto = easeInto;

export default BodyBrush;
