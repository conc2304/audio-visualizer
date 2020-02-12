import * as posenet from '@tensorflow-models/posenet';

const PoseNetService = {
  // PROPERTIES
  imageSource: null,
  poseCoords: [],
  isActive: false,
  appWidth: window.innerWidth,
  appHeight: window.innerHeight,
  net: null,
  history: [],

  // METHODS
  getPose,
  initializeNet,
};

// gets called on this on draw
async function getPose(p5) {
  // load the posenet model from a checkpoint

  if (PoseNetService.net !== null && PoseNetService.imageSource && PoseNetService.imageSource.elt) {
    PoseNetService.poseCoords = await PoseNetService.net.estimateSinglePose(
      PoseNetService.imageSource.elt,
      {
        flipHorizontal: false,
      },
    );
    // console.log(PoseNetService.poseCoords);
  }
}

async function initializeNet(p5) {
  PoseNetService.net = await posenet.load();
  PoseNetService.imageSource = p5.createCapture(p5.VIDEO);
  p5.imageMode(p5.CENTER);
}

export default PoseNetService;
