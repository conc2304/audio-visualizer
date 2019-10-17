


let s = (sketch) => {
  "use strict";
  
  sketch.setup = () => {
    sketch.createCanvas(400, 400);
  };
  
  sketch.draw = () => {
    let skinLight = sketch.color(255, 213, 147);
    let skinMed = sketch.color(234, 205, 159);
    let skinDark = sketch.color(193, 165, 120);
    let hairColor = sketch.color(63, 54, 40);
    let black = sketch.color(0, 0, 0);

    sketch.background(0, 0, 0, 0);

    drawFace(skinMed, skinDark, skinLight);
    drawEars(skinMed);
    drawHair(hairColor);
    drawEyes(black);
    drawEyebrows(hairColor);
  };
};

let myp5 = new p5(s, 'sketch-container');


let drawHair = (color) => {
  "use strict";

  myp5.fill(color)
  myp5.beginShape();
  myp5.curveVertex(148, 146);
  myp5.curveVertex(137, 161);
  myp5.curveVertex(138, 206);
  myp5.curveVertex(127, 186);
  myp5.curveVertex(123, 158);
  myp5.curveVertex(126, 114);
  myp5.curveVertex(168, 77);
  myp5.curveVertex(238, 78);
  myp5.curveVertex(274, 116);
  myp5.curveVertex(275, 162);
  myp5.curveVertex(268, 197);
  myp5.curveVertex(261, 211);
  myp5.curveVertex(261, 185);
  myp5.curveVertex(261, 161);
  myp5.curveVertex(250, 124);
  myp5.curveVertex(201, 131);
  myp5.curveVertex(144, 124);
  myp5.curveVertex(121, 206);
  myp5.endShape();

  // the bun
  myp5.beginShape();
  myp5.curveVertex(178, 79);
  myp5.curveVertex(169, 60);
  myp5.curveVertex(177, 49);
  myp5.curveVertex(196, 44);
  myp5.curveVertex(217, 45);
  myp5.curveVertex(226, 59);
  myp5.curveVertex(224, 74);
  myp5.curveVertex(210, 94);
  myp5.curveVertex(183, 91);
  myp5.curveVertex(172, 82);
  myp5.endShape();

  myp5.noFill();
  myp5.noStroke();
};

let drawEars = (color) => {
  "use strict";

  let center = myp5.width/2;

  myp5.fill(color);

  myp5.beginShape();
  myp5.curveVertex(center + 67, 159);
  myp5.curveVertex(center + 74, 154);
  myp5.curveVertex(center + 83, 153);
  myp5.curveVertex(center + 87, 168);
  myp5.curveVertex(center + 79, 186);
  myp5.curveVertex(center + 78, 196);
  myp5.curveVertex(center + 66, 199);
  myp5.curveVertex(center + 66, 177);
  myp5.endShape();

  myp5.beginShape();
  myp5.curveVertex(center - 67, 159);
  myp5.curveVertex(center - 74, 154);
  myp5.curveVertex(center - 83, 153);
  myp5.curveVertex(center - 87, 168);
  myp5.curveVertex(center - 79, 186);
  myp5.curveVertex(center - 78, 196);
  myp5.curveVertex(center - 66, 199);
  myp5.curveVertex(center - 66, 177);
  myp5.endShape();
};

let drawFace = (skinTone, shadeTone, lightTone) => {
  "use strict";

  myp5.fill(skinTone);

  let cX = myp5.width / 2;
  let fw = 130;

  let face = {
    w : fw,
    h : 100,
    x : cX - (fw/2),
    y : 150,
  };

  let jaw = {
    h : face.h / 1.7,
    w : face.w / 3,
  };

  //draw face box
  myp5.rect(face.x, face.y, face.w, face.h);

  // points for jaw
  let jawYStart = face.y + face.h;
  let qP = {
    x1 : face.x,
    y1 : jawYStart,
    x2 : face.x + face.w,
    y2 : jawYStart,
    x3 : cX + jaw.w / 2,
    y3 : jawYStart + jaw.h,
    x4 : cX - jaw.w / 2,
    y4 : jawYStart + jaw.h,
  };

  myp5.quad(qP.x1, qP.y1, qP.x2, qP.y2, qP.x3, qP.y3, qP.x4, qP.y4);
  myp5.rect(face.x, face.y, face.w, -45);   // fill in forehead

  // chin
  myp5.stroke(shadeTone);
  myp5.strokeWeight(1);
  myp5.noFill();
  myp5.arc(myp5.width / 2, qP.y3 - jaw.h / 3, 25, 10, myp5.PI, 0, myp5.OPEN);

  // nose
  let nose = {
    w : 20,
    h : 40,
  };

  myp5.stroke(lightTone);
  myp5.strokeWeight(2);
  myp5.line(cX + nose.w/5, myp5.height/2 - nose.h/2, cX + nose.w/2, myp5.height/2 + nose.h/2 );
  myp5.line(cX + nose.w/5, myp5.height/2 + nose.h/1.5, cX + nose.w/2, myp5.height/2 + nose.h/2 );

  //mouth
  myp5.stroke(0, 0, 0);
  myp5.strokeWeight(3);
  myp5.noFill();
  myp5.arc(cX, jawYStart, 40, 20, 0, myp5.PI - myp5.QUARTER_PI, myp5.OPEN);

  myp5.noStroke();
  myp5.noFill();
};

let drawEyes = (color) => {
  "use strict";

  let eyeConf = {
    c : myp5.width / 2,
    rangeX : 6,
    rangeY : 10,
    spread : 25,
    cY : 169,
  };

  let eyes = {
    l : {
      xMin : eyeConf.c - eyeConf.spread - eyeConf.rangeX,
      xMax : eyeConf.c - eyeConf.spread + eyeConf.rangeX,
    },
    r : {
      xMin : eyeConf.c + eyeConf.spread - eyeConf.rangeX,
      xMax : eyeConf.c + eyeConf.spread + eyeConf.rangeX,
    },
    yMin : eyeConf.cY - (eyeConf.rangeY/2),
    yMax : eyeConf.cY + (eyeConf.rangeY/2),
  };

  let eyeLX = myp5.map(myp5.mouseX, 0, myp5.width, eyes.l.xMin, eyes.l.xMax, true);
  let eyeRX = myp5.map(myp5.mouseX, 0, myp5.width, eyes.r.xMin, eyes.r.xMax, true);
  let eyeY = myp5.map(myp5.mouseY, 0, myp5.height, eyes.yMin, eyes.yMax, true);
  myp5.fill(color);
  myp5.ellipse(eyeLX, eyeY, 10, 12);
  myp5.ellipse(eyeRX, eyeY, 10, 12);

  myp5.noStroke();
  myp5.noFill();
};



let bL = {
  x1 : 182,
  y1 : 159,
  x2 : 160,
  y2 : 160,
};

let bR = {
  x1 : 213,
  y1 : 159,
  x2 : 233,
  y2 : 160,
};

let eyebrowState = 0;
let drawEyebrows = (color) => {
  "use strict";
  myp5.stroke(color);
  myp5.strokeWeight(3);

  if (myp5.mouseIsPressed) {
    eyebrowState = 1;
  }

  // raise the eyebrows
  let delta = .5;
  let raiseMax = 155;
  let raiseMin = 160;

  if (eyebrowState === 1) {
    if (bL.y2 > raiseMax) {
      bL.y1 -= delta;
      bL.y2 -= delta;
      bR.y1 -= delta;
      bR.y2 -= delta;
    }
  }
  if (eyebrowState === -1) {
    if (bL.y2 < raiseMin) {
      bL.y1 += delta;
      bL.y2 += delta;
      bR.y1 += delta;
      bR.y2 += delta;
    }
  }

  if (bL.y2 === raiseMax) {
    eyebrowState = -1;
  }
  if (bL.y2 === raiseMin) {
    eyebrowState = 0;
  }

  myp5.line(bR.x1, bR.y1, bR.x2, bR.y2);
  myp5.line(bL.x1, bL.y1, bL.x2, bL.y2);

  myp5.noStroke();
  myp5.noFill();
};


