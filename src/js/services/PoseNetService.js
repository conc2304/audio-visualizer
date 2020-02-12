import * as posenet from '@tensorflow-models/posenet';

const PoseNetService = {
  // PROPERTIES
  imageSource: null,
  poseCoords: [],
  isActive: false,
  appWidth: window.innerWidth,
  appHeight: window.innerHeight,
  net: null,

  // METHODS
  getPose,
  initializeNet,
};

// i want to call this on draw
async function getPose() {
  // load the posenet model from a checkpoint

  // console.log(PoseNetService.imageSource);
  if (PoseNetService.net !== null) {
    PoseNetService.poseCoords = await PoseNetService.net.estimateSinglePose(
      PoseNetService.imageSource,
      {
        flipHorizontal: false,
      },
    );
    console.log(PoseNetService.poseCoords);
  }
}

async function initializeNet(p5) {
  // MobileNet (smaller, faster, less accurate)
  const MobileNetConf = {
    architecture: 'MobileNetV1',
    outputStride: 16,
    inputResolution: {
      width: PoseNetService.appWidth,
      height: PoseNetService.appWidth,
    },
    // multiplier: 0.75,
    multiplier: 1,
  };

  // ResNet (larger, slower, more accurate)
  const ResNetConf = {
    architecture: 'ResNet50',
    outputStride: 32,
    inputResolution: {
      width: PoseNetService.appWidth,
      height: PoseNetService.appWidth,
    },
    quantBytes: 2,
  };

  PoseNetService.net = await posenet.load();

  PoseNetService.imageSource = p5.createCapture(p5.VIDEO);
  // PoseNetService.imageSource.remove();
  p5.imageMode(p5.CENTER);
  console.log(typeof PoseNetService.imageSource);
  // PoseNetService.imageSource.size(320, 240);
  console.log(PoseNetService.imageSource);
}

export default PoseNetService;
