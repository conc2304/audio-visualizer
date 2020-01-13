let color_col;
let pi = 3.14159265358979;
let position = {};

let shape = {
  x : 0,
  y : 0,
  width : 2,
  height : 2,
  translateY : 2,
  translateX : 2,
  iter : 400,
  k : 0,
  q : 1,
  theta : 1,
  deltaTheta : 400,
  velocity : 0.001,
};

let cnv;
function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  //frameRate(30);
}

function draw() {
  drawParametric();
}

function drawParametric() {
  arrowControls();
  background(0,0,20);
  noFill();

  shape.theta = 0;
  shape.x = 0;
  shape.y = 0;
  // shape.k ++;
  shape.q += shape.velocity;

  // color_col = [shape.k % 255, 128 + shape.k % 128, 255 - (shape.k % 128)];
  // stroke(color_col);
  strokeWeight(1);
  beginShape();

  for (i = 0; i < shape.iter; i++) {
    shape.k += .01;
    color_col = [shape.k % 255, 128 + shape.k % 128, 255 - (shape.k % 128)];
    stroke(color_col);
    shape.theta += shape.deltaTheta;

    position = parametricTest();
    // position = parametric009();

    curveVertex(position.x, position.y) ;
  }
  endShape();
}

function arrowControls() {

  if (keyIsDown(SHIFT)) {
    if (keyIsDown(LEFT_ARROW)){    // 219=[  16=shift{
      console.log(`velocity: ${shape.velocity}`);
      shape.velocity -= .01;
    }
    if (keyIsDown(RIGHT_ARROW)){    // 219=[  16=shift{
      console.log(`velocity: ${shape.velocity}`);
      shape.velocity += .01;
    }

    if (keyIsDown(221)){    // 219=[  16=shift{
      console.log(`iter: ${shape.iter}`);
      shape.iter += 5;
    }
    if (keyIsDown(219)){    // 219=[  16=shift{
      console.log(`iter: ${shape.iter}`);
      shape.iter -= 5;
    }
  }
  else {
    if (keyIsDown(UP_ARROW)) {
      shape.deltaTheta += .05;
      console.log(`deltaTheta : ${shape.deltaTheta}`);
    }
    if (keyIsDown(DOWN_ARROW)) {
      shape.deltaTheta -= .02;
      console.log(`deltaTheta : ${shape.deltaTheta}`);
    }
    if (keyIsDown(RIGHT_ARROW)) {
      shape.q += .1;
      console.log(`q: ${shape.q}`);
    }
    if (keyIsDown(LEFT_ARROW)) {
      shape.q -= .2;
      console.log(`q: ${shape.q}`);
    }
  }
}

function parametricRing(){
  return {
    x : sin(q * t ) * windowWidth/3 + windowWidth/2,
    y : cos(q * t ) * windowWidth/2 + windowWidth/3,
  };

}

function parametricPipe() {
  return {
    x : sin(q * t  ) * windowWidth/3 + windowWidth/4,
    y : tan(q * t ) * windowWidth/2 + windowWidth/2 ,
  };
}

function parametricTest() {

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
    max : 7,
    min : 2,
    rate : '?todo',
  };
  shape.width = map(shape.rate, -.5, .51, bounce.min, bounce.max);

// console.log(sin(shape.q));

  return {
    x : sin(shape.theta + cos(4 * shape.theta + shape.q)) * windowWidth/shape.width + windowWidth/2 + shape.translateX,
    y : cos(shape.theta) * windowHeight/shape.height + windowHeight/2 + shape.translateY,
  };
}

function parametricFullScreenPattern002() {
  //todo sharpen sensitivity rate
  let m = map(sin(shape.q), .000001, 1000, 10, 500);

  return {
    x : sin(shape.theta + cos(4 * shape.theta + shape.q)) * windowWidth/ (sin(m) / 2) + windowWidth/2 + shape.translateX,
    y : cos(shape.theta) * windowHeight/shape.height + windowHeight/2 + shape.translateY,
  };
}

function parametricFullScreenPattern001() {

  let m = map(sin(shape.theta), .000001, 1000, 10, 500);

  return {

    x : sin(shape.theta + cos(4 * shape.theta + shape.q)) * windowWidth/ (sin(m) / 2) + windowWidth/2 + shape.translateX,
    y : cos(shape.theta) * windowHeight/shape.height + windowHeight/2 + shape.translateY,
  };
}

function parametricVerticalNoise() {

  let m = map(sin(shape.theta + 2 * shape.theta), .000001, 5, .01, .02);

  return {

    x : sin(shape.theta + cos(4 * shape.theta + shape.q)) * windowWidth/m + windowWidth/2 + shape.translateX,
    y : cos(shape.theta) * windowHeight/shape.height + windowHeight/2 + shape.translateY,
  };
}

function parametric010() {

  return {
    x : cos(shape.q + sin(shape.theta + 2 * shape.theta)) * windowWidth/3 + windowWidth/2 + shape.translateX,
    y : cos(shape.theta + 2 * shape.q) * windowHeight/shape.height + windowHeight/2 + shape.translateY,
  };
}

function parametricTeardrop() {

  return {
    x : cos(shape.q + sin(shape.theta)) * windowWidth/3 + windowWidth/2 + shape.translateX,
    y : cos(shape.theta + shape.q) * windowHeight/shape.height + windowHeight/2 + shape.translateY,
  };
}


function parametric006() {
  return {
    x : sin(shape.theta + sin(shape.theta + shape.q)) * windowWidth/4 + windowWidth/2 + shape.translateX,
    y : cos(shape.theta + sin(shape.theta - shape.q)) * windowHeight/shape.height + windowHeight/2 + shape.translateY,
  };
}
function parametric009() {
  return {
    x : sin(shape.theta + cos(4 * shape.theta + shape.q)) * windowWidth/shape.width + windowWidth/2 + shape.translateX,
    y : cos(shape.theta) * windowHeight/shape.height + windowHeight/2 + shape.translateY,
  };
}

function parametric008() {
  return {
    x : sin(shape.theta + cos(4 * shape.theta + shape.q)) * windowWidth/shape.width + windowWidth/2 + shape.translateX,
    y : cos(shape.theta) * windowHeight/shape.height + windowHeight/2 + shape.translateY,
  };
}

function parametric007() {

  return {
    x : sin(shape.theta + sin(4 * shape.theta + shape.q)) * windowWidth/4 + windowWidth/2 + shape.translateX,
    y : cos(shape.theta + sin(4 * shape.theta + shape.q)) * windowHeight/shape.height + windowHeight/2 + shape.translateY,
  };
}
