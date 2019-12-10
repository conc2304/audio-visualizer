
let points;
let cs = [];
let l = [];
let c;
let r;
let font;

function preload() {
  font = loadFont('/clyzby/files/@custom/fonts/RubikMonoOne-Regular.ttf');
}

function setup() {

  let myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent("sketch-container");

  r = 1;
  textFont(font);
  textSize(300);
  points = font.textToPoints("404", width / 2 - 420, height / 1.5);
  for (let j = 0; j < points.length; j++) {
    cs[j] = new L(points[j].x, points[j].y, 0, 0, 10, null);
  }

  generate();
  background(0);
}

function draw() {

  for (let i = 0; i < l.length - 1; i++) {
    l[i].show();
    l[i].update();

    for (let j = 0; j < cs.length; j++) {
      if (l[i].collision(cs[j])) {
        l[i].stop = true;
      }
    }
  }
  if (l.length <= 1) {
    setTimeout(function () {
      background(0);
      generate();
      r = random(100)

    }, 2000)
  }
}

function generate() {
  for (let i = 0; i < 800; i++) {
    let index = i % cs.length;
    c = cs[index];
    let choice = floor(random(4));
    if (choice === 0) {
      l[i] = new L(random(width * random(1, choice)), 0, 0, 0, 1, c)
    } else if (choice === 1) {
      l[i] = new L(0, random(height * random(1, choice / 2)), 0, 0, 1, c)
    } else if (choice === 2) {
      l[i] = new L(width, random(height * random(1, choice)), 0, 0, 1, c)
    } else {
      l[i] = new L(random(width), height * random(1, choice / 2), 0, 0, 1, c)
    }
  }
}

function L(x, y, ax, ay, r, body) {
  this.pos = createVector(x, y);
  this.vel = createVector(random(12), random(12));
  this.acc = createVector(ax, ay);
  this.r = r;
  this.body = body;
  this.prev = createVector();
  this.stop = false
}

L.prototype.update = function () {
  if (!this.stop) {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);

    let des = p5.Vector.sub(this.body.pos, this.pos);
    des.setMag(r);
    let steer = p5.Vector.sub(des, this.vel);
    steer.limit(10);
    let randomI = random(7);
    steer.add(createVector(random(-randomI, randomI), random(-randomI, randomI)));
    this.acc.add(steer);

//      this.vel.add(1, 1);
    if (mouseIsPressed) {
      this.vel.add(createVector(cos(mouseX)), tan(mouseY));
    }
  }
};

L.prototype.collision = function (b) {
  let d = p5.Vector.dist(this.pos, b.pos);
  if (d < (this.r + this.body.r) / 2) {
    return true;
  } else {
    return false;
  }
};

L.prototype.show = function () {

  let r = map(mouseX, 0, width, 5, 15, true);
  let g = map(mouseX, 0, width, 69, 131, true);
  let b = map(mouseY, 0, height, 100, 205, true);
  let alpha = map(Math.sin(mouseY), 0, 1, 10, 255, true);

  if (mouseIsPressed) {
    r = g = b = alpha = 255;
  }

  stroke(r, g, b, alpha);
  ellipse(this.pos.x, this.pos.y, this.r)
};