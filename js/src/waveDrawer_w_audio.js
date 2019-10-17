/**
 *
 *    --  HERE ARE MY AMBITIONS - BEHOLD THEIR MULTITUDE!  --
 * todo - make a toggle to spin/rotate the inner and outer waves like the 3D ones
 * todo - make patterns by saving current config and make them triggerable (ie a pattern bank)
 * todo - put controls into an iFrame
 * todo - convert this entire thing into an angular web app #Angular8!
 * todo - loading animation
 *
 */




let audio;
let bgColor = 0;
var registeredCtrlElements = registeredCtrlElements || [];

let s = (sketch) => {
  'use strict';


  // keep all 'custom' code here

  sketch.preload = () => {
    sketch.objects = {};
    sketch.objects.lambo = myp5.loadModel('/files/3d_obj/lp670.obj', true);
    sketch.objects.glock = myp5.loadModel('/files/3d_obj/Glock 3d.obj', true);
    sketch.objects.dolphin = myp5.loadModel('/files/3d_obj/dolphin.obj', true);
    sketch.objects.ducky = myp5.loadModel('/files/3d_obj/ducky.obj', true);
    sketch.objects.satellite = myp5.loadModel('/files/3d_obj/satellite.obj', true);
    sketch.objects.sword = myp5.loadModel('/files/3d_obj/sword.obj', true);
    sketch.objects.whale = myp5.loadModel('/files/3d_obj/whale.obj', true);
    sketch.objects.shuttle = myp5.loadModel('/files/3d_obj/shuttle.obj', true);

    sketch.ctrlElementsArray = registeredCtrlElements;
  };


  sketch.setup = () => {

    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight, sketch.WEBGL);
    sketch.polygon = renderPolygon;
    sketch.colorMode(sketch.HSB);

    // make a method to retrieve the elements externally by the myp5 namespace
    for (let ctrlElement in sketch.ctrlElementsArray) {
      if (!sketch.ctrlElementsArray.hasOwnProperty(ctrlElement)) {
        continue;
      }
      let ctrlObjectName = sketch.ctrlElementsArray[ctrlElement].constructor.name;
      sketch[`get${ctrlObjectName}`] = () => sketch.ctrlElementsArray[ctrlElement];
    }

    // add all of the elements to a global variable to 'register' them
    createDOMControls(sketch.ctrlElementsArray);

    // when everything is loaded open the control bar
    $("#settings-open").click();

    p5setupPoseNet(sketch);
  };


  sketch.windowResized = () => {

    // todo this is taxing on the browser find out how to optimize
    for (let ctrlElement in sketch.ctrlElementsArray) {
      if (!sketch.ctrlElementsArray.hasOwnProperty(ctrlElement)) {
        continue;
      }

      sketch.ctrlElementsArray[ctrlElement].width = sketch.windowWidth;
      sketch.ctrlElementsArray[ctrlElement].waveWidth = sketch.windowWidth + 200;
      sketch.ctrlElementsArray[ctrlElement].height = sketch.windowHeight;
    }
    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
  };


  let fftAnalysis = {};
  let tempObj;
  sketch.draw = () => {
    sketch.background(bgColor);
  

    if (audio && audio.isLoaded() && !audio.isPaused()) {
      let seconds = Math.floor(audio.currentTime() % 60);
      let minutes = Math.floor(audio.currentTime() / 60);

      let time = ('0' + minutes).substr(-2) + ':' + ('0' + seconds).substr(-2);
      songTime.html(time);
      let downloadProgress = 100 * (audio.currentTime() / audio.duration())
      progressBar.val(downloadProgress);
    }

    fftAnalysis = getEQEnergy(fft);
    applyAudioEnergyValues(fftAnalysis);

    playKeyboardKeys();
    sketch.keyReleased = () => {
      playPianoKey(sketch.keyCode, false);
    };

    for (let ctrlElement in sketch.ctrlElementsArray) {
      if (!sketch.ctrlElementsArray.hasOwnProperty(ctrlElement)) {
        continue;
      }
      tempObj =  sketch.ctrlElementsArray[ctrlElement];
      // don't render an object if we have made it not visible it
      if (tempObj.bypass === true) {
        continue;
      }

      tempObj.easeInto();
      tempObj.render();
    }
  };


};



// todo - this probably needs to be moved to a new file
let renderPolygon = function (x, y, radius, numPoints) {
  'use strict';
  let angle = myp5.TWO_PI / numPoints;
  myp5.beginShape();
  for (let a = 0; a < myp5.TWO_PI; a += angle) {
    let sx = x + myp5.cos(a) * radius;
    let sy = y + myp5.sin(a) * radius;
    myp5.vertex(sx, sy);
  }
  myp5.endShape(myp5.CLOSE);
};


let myp5 = new p5(s, 'sketch-container');




