let cyan = "0,255,255";
let magenta = "255,0,255";
let yellow = "255,255,0";
let color_col;
let position = {};

let shape001 = {
  x : 0,
  y : 0,
  width : 2,
  height : 2,
  translateY : 2,
  translateX : 2,
  iter : 400,
  color : {
    r : 255,
    g : 0,
    b : 255,
    a : 1,
    k : 0,
    deltaK : 0,  //.1
  },
  q : 1,
  theta : 1,
  deltaTheta : 400,
  velocity : 0.001,
  parametricType : parametricTest,
};

let shape002 = {
  x : 0,
  y : 0,
  width : 2,
  height : 2,
  translateY : 2,
  translateX : 2,
  iter : 400,
  color : {
    r : 0,
    g : 255,
    b : 255,
    a : 1,
    k : 0,
    deltaK : 0,  //.1
  },
  q : 1,
  theta : 1,
  deltaTheta : 400,
  velocity : 0.001,
  parametricType : parametric006,
};

let shape003 = {
  x : 0,
  y : 0,
  width : 2,
  height : 2,
  translateY : 2,
  translateX : 2,
  iter : 400,
  color : {
    r : 255,
    g : 255,
    b : 0,
    a : 1,
    k : 0,
    deltaK : 0,  //.1
  },
  q : 1,
  theta : 1,
  deltaTheta : 400,
  velocity : 0.001,
  parametricType : parametric009,

};

let cnv;
function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  //frameRate(30);
}

let bounce = 0;
function draw() {
   bounce += .01;

  background(0,0,0);
  noFill();


  arrowControls();

  // pop();
  applyMatrix(1, 0, 0, 1, 1, 0);
  drawParametric(shape001);
  // push();

  applyMatrix(1, 0, 0, 1, 5, 10);
  drawParametric(shape002);

  // applyMatrix(1, 0, 0, 1, windowWidth/3, 50);
  drawParametric(shape003);
}

function drawParametric(shape) {

  shape.theta = 0;
  shape.x = 0;
  shape.y = 0;
  shape.color.k += shape.color.deltaK;
  shape.q += shape.velocity;

  if (shape.color.k > 0) {
    shape.color.r = shape.color.k % 255;
    shape.color.g = 128 + shape.color.k % 128;
    shape.color.b = 255 - (shape.color.k % 128);
  }

  color_col = [shape.color.r, shape.color.g, shape.color.b];
  stroke(color_col);
  // strokeWeight(1);
  beginShape();

  for (i = 0; i < shape.iter; i++) {
    // shape.k += .01;
    shape.theta += shape.deltaTheta;

    position = shape.parametricType(shape);

    curveVertex(position.x, position.y) ;
  }
  endShape();
}

function arrowControls() {

  if (keyIsDown(SHIFT)) {
    if (keyIsDown(LEFT_ARROW)){    // 219=[  16=shift{
      console.log(`velocity: ${shape001.velocity}`);
      shape001.velocity -= .01;
      shape002.velocity -= .01;
      shape003.velocity -= .01;
    }
    if (keyIsDown(RIGHT_ARROW)){    // 219=[  16=shift{
      console.log(`velocity: ${shape001.velocity}`);
      shape001.velocity += .01;
      shape002.velocity += .01;
      shape003.velocity += .01;
    }

    if (keyIsDown(221)){    // 219=[  16=shift{
      console.log(`iter: ${shape001.iter}`);
      shape001.iter += 5;
      shape002.iter += 5;
      shape003.iter += 5;
    }
    if (keyIsDown(219)){    // 219=[  16=shift{
      console.log(`iter: ${shape001.iter}`);
      shape001.iter -= 5;
      shape002.iter -= 5;
      shape003.iter -= 5;
    }
  }
  else {
    if (keyIsDown(UP_ARROW)) {
      shape001.deltaTheta += .05;
      shape002.deltaTheta += .05;
      shape003.deltaTheta += .05;
      console.log(`deltaTheta : ${shape001.deltaTheta}`);
    }
    if (keyIsDown(DOWN_ARROW)) {
      shape001.deltaTheta -= .02;
      shape002.deltaTheta -= .02;
      shape003.deltaTheta -= .02;
      console.log(`deltaTheta : ${shape001.deltaTheta}`);
    }
    if (keyIsDown(RIGHT_ARROW)) {
      shape001.q += .1;
      shape002.q += .1;
      shape003.q += .1;
      console.log(`q: ${shape001.q}`);
    }
    if (keyIsDown(LEFT_ARROW)) {
      shape001.q -= .2;
      shape002.q -= .2;
      shape003.q -= .2;
      console.log(`q: ${shape001.q}`);
    }
  }
}

function parametricRing(shape){
  return {
    x : sin(shape.q * shape.theta ) * windowWidth/3 + windowWidth/2,
    y : cos(shape.q * shape.theta ) * windowWidth/2 + windowWidth/3,
  };

}

function parametricPipe(shape) {
  return {
    x : sin(shape.q * shape.theta  ) * windowWidth/3 + windowWidth/4,
    y : tan(shape.q * shape.theta ) * windowWidth/2 + windowWidth/2 ,
  };
}

function parametricTest(shape) {

  // todo control the xy growth of the shape
  let bounce = {
    max : 7,
    min : 6,
    rate : '?todo',
  };
  shape.width = sin(map(shape.q, 0, .51, bounce.min, bounce.max));
  shape.height = sin(map(shape.q, 0, .51, bounce.min, bounce.max));

  let shapeWidth = (windowWidth/shape.width) / cos(shape.theta + sin(Math.pow(sin(shape.q), 1)) + sin(shape.theta));
  let shapeHeight =  windowHeight/shape.height;
  let xCenter = windowWidth/2  + shape.translateX;
  let yCenter = (windowHeight/2 + shape.translateY) / .5 * cos(shape.theta + sin(Math.pow(sin(shape.q), 1)) + sin(shape.theta));

  return {
    x : cos(shape.q + sin(shape.theta)) * windowWidth/shape.width + windowWidth/2 + shape.translateX,
    y : cos(shape.theta) * windowHeight/shape.height + windowHeight/2 + shape.translateY,
  };
}

function parametricBounceRing(shape) {

  let shapeWidth = windowWidth/shape.width;
  let shapeHeight =  windowHeight/shape.height;
  let xCenter = windowWidth/2  + shape.translateX;
  let yCenter = windowHeight/2 + shape.translateY;

  return {
    x : sin(shape.theta + Math.pow(cos(shape.q), 3)) * shapeWidth + xCenter,
    y : cos(shape.theta + sin(Math.pow(sin(shape.theta), 3))) * shapeHeight + yCenter,
  };
}


function parametricFullScreenStrobeRing() {

  // todo control the xy growth of the shape
  let bounce = {
    max : 7,
    min : 6,
    rate : '?todo',
  };
  shape.width = sin(map(shape.q, 0, .51, bounce.min, bounce.max));
  shape.height = sin(map(shape.q, 0, .51, bounce.min, bounce.max));

// console.log(sin(shape.q));

  return {
    x : cos(shape.q + sin(shape.theta)) * windowWidth/shape.width + windowWidth/2 + shape.translateX,
    y : cos(shape.theta) * windowHeight/shape.height + windowHeight/2 + shape.translateY,
  };
}

function parametricFullScreenBounce() {

  // todo control the xy growth of the shape
  let bounce = {
    max : 7,
    min : 6,
    rate : '?todo',
  };
  shape.width = sin(map(shape.q, 0, .51, bounce.min, bounce.max));

// console.log(sin(shape.q));

  return {
    x : cos(shape.q + sin(shape.theta)) * windowWidth/shape.width + windowWidth/2 + shape.translateX,
    y : cos(shape.theta) * windowHeight/shape.height + windowHeight/2 + shape.translateY,
  };
}

function parametricSizeBounceTest() {

  // todo control the xy growth of the shape
  let bounce = {
    max : 3.5,
    min : 3,
    rate : '', // todo
  };
  shape.width = map(shape.q, -.5, .51, bounce.min, bounce.max);
  let shapeWidth = windowWidth/shape.width;
  let shapeHeight =  windowHeight/shape.height;
  let xCenter = windowWidth/2  + shape.translateX;
  let yCenter = windowHeight/2 + shape.translateY;

  return {
    x : sin(shape.theta + cos(4 * shape.theta + shape.q)) * shapeWidth + xCenter,
    y : cos(shape.theta) * shapeHeight + yCenter,
  };
}

function parametricFullScreenPattern002(shape) {
  //todo sharpen sensitivity rate
  let m = map(sin(shape.q), .000001, 1000, 10, 500);

  return {
    x : sin(shape.theta + cos(4 * shape.theta + shape.q)) * windowWidth/ (sin(m) / 2) + windowWidth/2 + shape.translateX,
    y : cos(shape.theta) * windowHeight/shape.height + windowHeight/2 + shape.translateY,
  };
}

function parametricFullScreenPattern001(shape) {

  let m = map(sin(shape.theta), .000001, 1000, 10, 500);

  return {

    x : sin(shape.theta + cos(4 * shape.theta + shape.q)) * windowWidth/ (sin(m) / 2) + windowWidth/2 + shape.translateX,
    y : cos(shape.theta) * windowHeight/shape.height + windowHeight/2 + shape.translateY,
  };
}

function parametricVerticalNoise(shape) {

  let m = map(sin(shape.theta + 2 * shape.theta), .000001, 5, .01, .02);

  return {

    x : sin(shape.theta + cos(4 * shape.theta + shape.q)) * windowWidth/m + windowWidth/2 + shape.translateX,
    y : cos(shape.theta) * windowHeight/shape.height + windowHeight/2 + shape.translateY,
  };
}

function parametric010(shape) {

  return {
    x : cos(shape.q + sin(shape.theta + 2 * shape.theta)) * windowWidth/3 + windowWidth/2 + shape.translateX,
    y : cos(shape.theta + 2 * shape.q) * windowHeight/shape.height + windowHeight/2 + shape.translateY,
  };
}

function parametricTeardrop(shape) {

  return {
    x : cos(shape.q + sin(shape.theta)) * windowWidth/shape.width + windowWidth/2 + shape.translateX,
    y : cos(shape.theta + shape.q) * windowHeight/shape.height + windowHeight/2 + shape.translateY,
  };
}



function parametric009(shape) {
  return {
    x : sin(shape.theta + cos(4 * shape.theta + shape.q)) * windowWidth/shape.width + windowWidth/2 + shape.translateX,
    y : cos(shape.theta) * windowHeight/shape.height + windowHeight/2 + shape.translateY,
  };
}

function parametric008(shape) {
  return {
    x : sin(shape.theta + cos(4 * shape.theta + shape.q)) * windowWidth/shape.width + windowWidth/2 + shape.translateX,
    y : cos(shape.theta) * windowHeight/shape.height + windowHeight/2 + shape.translateY,
  };
}

function parametric007(shape) {

  return {
    x : sin(shape.theta + sin(4 * shape.theta + shape.q)) * windowWidth/4 + windowWidth/2 + shape.translateX,
    y : cos(shape.theta + sin(4 * shape.theta + shape.q)) * windowHeight/shape.height + windowHeight/2 + shape.translateY,
  };
}

function parametric006(shape) {
  return {
    x : sin(shape.theta + sin(shape.theta + shape.q)) * windowWidth/4 + windowWidth/2 + shape.translateX,
    y : cos(shape.theta + sin(shape.theta - shape.q)) * windowHeight/shape.height + windowHeight/2 + shape.translateY,
  };
}