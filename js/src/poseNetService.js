let video;
let poses = [];
let poseInstance;
let pose;

const partsToTrack = ['nose', 'rightWrist', 'rightElbow', 'leftElbow', 'leftWrist', 'rightAnkle', 'leftAnkle', 'leftHip', 'rightHip'];


let p5setupPoseNet = sketch => {
  video = createCapture(sketch.VIDEO);
  video.size(sketch.width, sketch.height);

  const ml5Options = {
    imageScaleFactor: 0.2,
    outputStride: 16,  // 8, 16, 32
    flipHorizontal: true,
    minConfidence: 0.5,
    maxPoseDetections: 1,
    scoreThreshold: 0.5,
    nmsRadius: 20,
    detectionType: 'single',
    multiplier: 0.75,
  }

  // Create a new poseNet method with a single detection
  const poseNet = ml5.poseNet(video, ml5Options, function () { console.log('ML5 Model Loaded') });
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", function (results) {
    poses = results;
  });

  // Hide the video element, and just show the canvas
  video.hide();

  initializeBoids(sketch.width, sketch.height);
};

class PoseDetector {
  constructor(windowWidth, windowHeight) {
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.easeInto = easeInto;
    this.history = [];
    this.colorRotate = true;
    this.bypass = true;


    this.mode = {
      displayLabel: "Mode",
      resetValue: "Triangulate",
      defaultValue: "Triangulate",
      currentValue: "Triangulate",
      targetValue: null,
      options: ["Flocking", "Triangulate",],
      attrType: "variable",
      lockOn: false
    };

    this.radius = {
      displayLabel: "Size",
      description: "Sets the size of all of the 3D shapes.",
      resetValue: 40,
      defaultValue: 40,
      currentValue: 40,
      targetValue: null,
      min: 20, // this can be edited by the user
      defaultMin: 20, // this is the range within which the user can edit the min and max values
      max: 500, // this can be edited by the user
      defaultMax: 500, // this is the range within which the user can edit the min and max values
      attrType: "numeric",
      triggerSource: null,
      lockOn: false,
      audio: {
        responsiveType: "add",
        responsiveOptions: ["add", "subtract"],
        gain: 0.5,
        fall: 1
      },
      easingValue: 0.7,
      noteHeldEasing: 0.05,
      easingMax: 0,
      easingMin: 0
    };

    this.trailLength = {
      displayLabel: "Trail Length",
      resetValue: 50,
      defaultValue: 50,
      currentValue: 50,
      targetValue: null,
      min: 0, // this can be edited by the user
      defaultMin: 0, //  this is the range within which the user can edit the min and max values
      max: 100, // this can be edited by the user
      defaultMax: 100, //  this is the range within which the user can edit the min and max values
      attrType: "numeric",
      audio: {
        responsiveType: "add",
        responsiveOptions: ["add", "subtract"],
        gain: 0.5,
        fall: 1 // not sure what this will do yet
      },
      triggerSource: null,
      lockOn: false,
      easingValue: 0.7,
      noteHeldEasing: 0.1,
      easingMax: 0,
      easingMin: 0
    };

    this.magnitude = {
      displayLabel: "Magnitude",
      resetValue: 8,
      defaultValue: 8,
      currentValue: 8,
      targetValue: null,
      min: 3, // this can be edited by the user
      defaultMin: 3, //  this is the range within which the user can edit the min and max values
      max: 14, // this can be edited by the user
      defaultMax: 14, //  this is the range within which the user can edit the min and max values
      attrType: "numeric",
      audio: {
        responsiveType: "add",
        responsiveOptions: ["add", "subtract"],
        gain: 0.5,
        fall: 1 // not sure what this will do yet
      },
      triggerSource: null,
      lockOn: false,
      easingValue: 0.7,
      noteHeldEasing: 0.1,
      easingMax: 0,
      easingMin: 0
    };

    this.shape = {
      displayLabel: "Keypoint Shape",
      resetValue: "off",
      defaultValue: "off",
      currentValue: "off",
      targetValue: null,
      options: ["off", "line", "triangle", "square", "pentagon", "ellipse"],
      attrType: "variable",
      lockOn: false
    };

    this.hue = {
      displayLabel: "Color",
      resetValue: 100,
      defaultValue: 100,
      currentValue: 200,
      targetValue: null,
      min: 0, // this can be edited by the user
      defaultMin: 0, //  this is the range within which the user can edit the min and max values
      max: 360, // this can be edited by the user
      defaultMax: 360, //  this is the range within which the user can edit the min and max values
      attrType: "numeric",
      audio: {
        responsiveType: "add",
        responsiveOptions: ["add", "subtract"],
        gain: 0.5,
        fall: 1 // not sure what this will do yet
      },
      triggerSource: null,
      lockOn: false,
      easingValue: 0.1,
      noteHeldEasing: 0.1,
      easingMax: 0,
      easingMin: 0
    };

    this.saturation = {
      displayLabel: "Saturation",
      resetValue: 100,
      defaultValue: 100,
      currentValue: 100,
      targetValue: null,
      min: 0, // this can be edited by the user
      defaultMin: 0, //  this is the range within which the user can edit the min and max values
      max: 100, // this can be edited by the user
      defaultMax: 100, //  this is the range within which the user can edit the min and max values
      attrType: "numeric",
      audio: {
        responsiveType: "add",
        responsiveOptions: ["add", "subtract"],
        gain: 0.5,
        fall: 1 // not sure what this will do yet
      },
      triggerSource: null,
      lockOn: false,
      easingValue: 0.1,
      noteHeldEasing: 0.1,
      easingMax: 0,
      easingMin: 0
    };
  }
}

PoseDetector.prototype.render = function () {
  // We can call both functions to draw all keypoints and the skeletons

  if (this.mode.currentValue === "Flocking") {
    flock.run();
  }

  if (this.mode.currentValue === "Triangulate") {
    createParticle();
    renderParticleNet();
  }

  if (this.mode.currentValue === "Shaper") {
    this.renderShaper();
  }

  this.drawKeypoints();
  this.drawTrailers();
  // this.drawSkeleton();
};



// A function to draw ellipses over the detected keypoints
PoseDetector.prototype.drawKeypoints = function () {
  // Loop through all the poses detected
  if (!poses) {
    return;
  }

  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    this.history.unshift(pose);
    myp5.noFill();
    myp5.strokeWeight(3);
    myp5.stroke(this.hue.currentValue, this.saturation.currentValue, 100);
    this.renderPose(pose);
  }
};

PoseDetector.prototype.drawSkeleton = function () {
  // Loop through all the skeletons detected
  if (!poses) {
    return;
  }
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      myp5.stroke(this.hue.currentValue, this.saturation.currentValue, 100);
      myp5.stroke(0, this.saturation.currentValue, 100);
      myp5.strokeWeight(8);
      myp5.line(
        partA.position.x,
        partA.position.y,
        partB.position.x,
        partB.position.y
      );
    }
  }
};


PoseDetector.prototype.drawTrailers = function () {
  this.history = this.history.slice(0, this.trailLength.currentValue);
  let historyLength = this.history.length;

  for (let i = 0; i < historyLength; i++) {
    let percent = (historyLength - (i + 1)) / historyLength;
    let rotationAmount = myp5.map(percent, 0, 1, 0, 100);
    let pose = this.history[i];
    let tempHue = this.hue.currentValue;

    let hue =
      this.colorRotate === true ? (tempHue + rotationAmount) % 360 : tempHue;

    myp5.noFill();
    myp5.strokeWeight(3);
    myp5.stroke(hue, this.saturation.currentValue, rotationAmount);
    this.renderPose(pose);
  }
};


PoseDetector.prototype.renderPose = function (pose) {
  for (let j = 0; j < pose.keypoints.length; j++) {
    // A keypoint is an object describing a body part (like rightArm or leftShoulder)
    let keypoint = pose.keypoints[j];
    if (keypoint.score > 0.2) {

      this.renderShape(
        keypoint.position.x - this.windowWidth / 2,
        keypoint.position.y - this.windowHeight / 2,
        this.radius.currentValue
      );
    }
  }
};

/**
 * Renders a given shape along the the passed x and y positions.
 * @param xPos
 * @param yPos
 * @param radius
 */
PoseDetector.prototype.renderShape = function (xPos, yPos, radius) {
  let polygons = ["line", "triangle", "square", "pentagon"]; // polygons we are allowing for set in the shape attribute

  if (this.shape.currentValue === "off") {
    return;
  }
  if (this.shape.currentValue === "ellipse") {
    myp5.ellipse(xPos, yPos, radius, radius); // one above and one below
  } else if (polygons.includes(this.shape.currentValue)) {
    let sides;
    switch (this.shape.currentValue) {
      case "line":
        sides = 2;
        break;
      case "triangle":
        sides = 3;
        break;
      case "square":
        sides = 4;
        break;
      case "pentagon":
        sides = 5;
        break;
    }
    myp5.push();
    myp5.strokeWeight(3);
    myp5.translate(xPos, yPos);
    myp5.rotate(myp5.atan(myp5.frameCount / 50.0));
    myp5.polygon(0, 0, radius, sides);
    myp5.pop();
  } else {
    myp5.ellipse(xPos, yPos, radius, radius); // one above and one below
  }
};




// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com
// Flock object
// Does very little, simply manages the array of all the boids
class Flock {
  constructor() {
    // An array for all the boids
    this.boids = []; // Initialize the array
  }
  run() {
    for (let i = 0; i < this.boids.length; i++) {
      this.boids[i].run(this.boids, i); // Passing the entire list of boids to each boid individually
    }
  }
  addBoid(b) {
    this.boids.push(b);
  }
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com
// Boid class
// Methods for Separation, Cohesion, Alignment added
class Boid {
  constructor(x, y) {
    this.acceleration = myp5.createVector(0, 0);
    this.velocity = myp5.createVector(myp5.random(-1, 1), myp5.random(-1, 1));
    // if (flipHorizintal) {
    // this.position = myp5.createVector(-x, y);
    // }
    // else {
    this.position = myp5.createVector(x, y);
    // }
    this.r = 5;
    this.maxspeed = 8; // Maximum speed
    this.maxforce = 0.8; // Maximum steering force .8
  }
  run(boids) {
    this.flock(boids);
    this.updateBoid();
    this.boidBorders();
    this.renderBoid();
  }
  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }
  // We accumulate a new acceleration each time based on three rules
  flock(boids) {
    let sep = this.separateBoids(boids); // Separation
    let ali = this.alignBoids(boids); // Alignment
    let coh = this.boidCohesion(boids); // Cohesion
    // Arbitrarily weight these forces
    sep.mult(1.5);
    ali.mult(1.0);
    coh.mult(1.0);
    // Add the force vectors to acceleration
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }
  // Method to update location
  updateBoid() {
    // Update velocity
    this.maxspeed = poseInstance.magnitude.currentValue;

    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelertion to 0 each cycle
    this.acceleration.mult(0);
  }
  // A method that calculates and applies a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  seekBoid(target) {
    let nearestTarget = getNearestTartget(this.position);
    // console.log(nearestTarget);
    // console.log(nearestTarget);
    let homingDirection = myp5.createVector(nearestTarget.x, nearestTarget.y);
    //   let homingDirection = myp5.createVector(myp5.mouseX, myp5.mouseY);
    let desired = p5.Vector.sub(homingDirection, this.position); // A vector pointing from the location to the target
    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(this.maxspeed);
    // Steering = Desired minus Velocity
    let steer = p5.Vector.sub(desired, this.velocity);
    this.maxforce = myp5.map(poseInstance.magnitude.currentValue, poseInstance.magnitude.min, poseInstance.magnitude.min, 0.03, 1)
    steer.limit(this.maxforce); // Limit to maximum steering force
    return steer;
  }
  renderBoid() {
    this.r = myp5.map(poseInstance.radius.currentValue, poseInstance.radius.min, poseInstance.radius.max, 1, 30, true);
    // Draw a triangle rotated in the direction of velocity
    let theta = this.velocity.heading() + radians(90);
    myp5.noFill();
    myp5.stroke(poseInstance.hue.currentValue, poseInstance.saturation.currentValue, 200);
    myp5.strokeWeight(2);
    myp5.push();
    myp5.translate(this.position.x - myp5.width / 2, this.position.y - myp5.height / 2);
    myp5.rotate(theta);
    myp5.beginShape();
    myp5.vertex(0, -this.r* 2);
    myp5.vertex(-this.r, this.r * 5);
    myp5.vertex(this.r, this.r * 5);
    myp5.endShape(CLOSE);
    myp5.pop();
  }
  // Wraparound
  boidBorders() {
    if (this.position.x < -this.r)
      this.position.x = myp5.width + this.r;
    if (this.position.y < -this.r)
      this.position.y = myp5.height + this.r;
    if (this.position.x > myp5.width + this.r)
      this.position.x = -this.r;
    if (this.position.y > myp5.height + this.r)
      this.position.y = -this.r;
  }
  // Separation
  // Method checks for nearby boids and steers away
  separateBoids(boids) {
    let desiredseparation = myp5.map(poseInstance.trailLength.currentValue, poseInstance.trailLength.min, poseInstance.trailLength.max, 10, 60);
    let steer = myp5.createVector(0, 0);
    let count = 0;
    // For every boid in the system, check if it's too close
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position, boids[i].position);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if (d > 0 && d < desiredseparation) {
        // Calculate vector pointing away from neighbor
        let diff = p5.Vector.sub(this.position, boids[i].position);
        diff.normalize();
        diff.div(d); // Weight by distance
        steer.add(diff);
        count++; // Keep track of how many
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      steer.div(count);
    }
    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }
  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  alignBoids(boids) {
    let neighbordist = 50;
    let sum = createVector(0, 0);
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position, boids[i].position);
      if (d > 0 && d < neighbordist) {
        sum.add(boids[i].velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxspeed);
      let steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(this.maxforce);
      return steer;
    }
    else {
      return createVector(0, 0);
    }
  }
  // Cohesion
  // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
  boidCohesion(boids) {
    let neighbordist = 50;
    let sum = myp5.createVector(0, 0); // Start with empty vector to accumulate all locations
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position, boids[i].position);
      if (d > 0 && d < neighbordist) {
        sum.add(boids[i].position); // Add location
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seekBoid(sum); // Steer towards the location
    }
    else {
      return myp5.createVector(0, 0);
    }
  }
}


let flock;
function initializeBoids(windowWidth, windowHeight) {
  flock = new Flock();
  // Add an initial set of boids into the system
  for (let i = 0; i < 100; i++) {
    let b = new Boid(windowWidth, windowHeight);
    flock.addBoid(b);
  }
}

// Add a new boid into the System
function addBoid() {
  flock.addBoid(new Boid(myp5.mouseX - myp5.width, myp5.mouseY));
}



function getNearestTartget(seeker) {
  let distance = null;
  let position = { x: 0, y: 0 };


  if (!poses || poses.length <= 0 || !poses[0].pose.keypoints) {
    return position;
  }
  let keypoints = poses[0].pose.keypoints;

  for (let i = 0; i < keypoints.length; i++) {
    // A keypoint is an object describing a body part (like rightArm or leftShoulder)
    let keypoint = keypoints[i];
    if (keypoint.score < 0.2) {
      continue;
    }

    if (keypoint.position.x > myp5.width || keypoint.position.x < 0 || keypoint.position.y < 0 || keypoint.position.y > myp5.height) {
      continue;
    }

    if (!partsToTrack.includes(keypoint.part)) {
      continue;
    }

    let part = keypoint.part.toLowerCase();
    let gravity = 0;

    // have a graviational preference to these body parts
    if (part.includes('wrist')) {
      gravity = 0.4;
    }
    else if (part.includes('ankle')) {
      gravity = 0.3;
    }
    else if (part.includes('elbow')) {
      gravity = 0.1;
    }
    else if (part.includes('nose')) {
      gravity = 0.1;
    }
    else if (part.includes('hip')) {
      gravity = 0.05;
    }



    nextDistance = getDistance(seeker, keypoint.position);
    nextDistance = nextDistance * gravity;

    if (distance === null) {
      currentDistance = nextDistance;
      position = {
        x: keypoint.position.x,
        y: keypoint.position.y,
        part: keypoint.part
      };
    }

    if (currentDistance <= nextDistance) {
      distance = currentDistance;
      position = {
        x: keypoint.position.x,
        y: keypoint.position.y,
        part: keypoint.part
      };
    }
  }
  // }


  return position;
}

function getDistance(p, q) {
  let dx = p.x - q.x;
  let dy = p.y - q.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  return dist;
}



/*
Frozen brush

Makes use of a delaunay algorithm to create crystal-like shapes.
I did NOT develop delaunay.js, and not sure who the author really is to give proper credit.

Controls:
	- Drag the mouse.
    - Press any key to toggle between fill and stroke.

Inspired by:
	Makio135's sketch www.openprocessing.org/sketch/385808

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
*/

var allParticles = [];
var maxLevel = 5;
var useFill = false;

var data = [];


// Moves to a random direction and comes to a stop.
// Spawns other particles within its lifetime.
class Particle {
  constructor(x, y, level) {
    this.level = level;
    this.life = 0;
    this.pos = new p5.Vector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(map(this.level, 0, maxLevel, 6, 2));
    this.move = function () {
      this.life++;
      // Add friction.
      this.vel.mult(0.9);
      this.pos.add(this.vel);
      // Spawn a new particle if conditions are met.
      if (this.life % 10 == 0) {
        if (this.level > 0) {
          this.level -= 1;
          var newParticle = new Particle(this.pos.x, this.pos.y, this.level - 1);
          allParticles.push(newParticle);
        }
      }
    };
  }
}




function renderParticleNet() {

  // Move and spawn particles.
  // Remove any that is below the velocity threshold.
  for (var i = allParticles.length - 1; i > -1; i--) {
    allParticles[i].move();

    if (allParticles[i].vel.mag() < myp5.map(poseInstance.magnitude.currentValue, poseInstance.magnitude.min, poseInstance.magnitude.max, 0.05,  0.5)) {
      allParticles.splice(i, 1);
    }
  }

  if (allParticles.length > 0) {
    // Run script to get points to create triangles with.
    data = Delaunay.triangulate(allParticles.map(function (pt) {
      return [pt.pos.x, pt.pos.y];
    }));

    myp5.strokeWeight(0.1);

    // Display triangles individually.
    for (var i = 0; i < data.length; i += 3) {
      // Collect particles that make this triangle.
      var p1 = allParticles[data[i]];
      var p2 = allParticles[data[i + 1]];
      var p3 = allParticles[data[i + 2]];

      // Don't draw triangle if its area is too big.
      var distThreshMax = myp5.map(poseInstance.trailLength.currentValue, poseInstance.trailLength.min, poseInstance.trailLength.max, 100, 500);
      var distTreshMin = myp5.map(poseInstance.trailLength.currentValue, poseInstance.trailLength.min, poseInstance.trailLength.max, 5, 30);

      if (myp5.dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y) > distThreshMax || myp5.dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y) < distTreshMin) {
        continue;
      }

      if (myp5.dist(p2.pos.x, p2.pos.y, p3.pos.x, p3.pos.y) > distThreshMax || myp5.dist(p2.pos.x, p2.pos.y, p3.pos.x, p3.pos.y) < distTreshMin) {
        continue;
      }

      if (myp5.dist(p1.pos.x, p1.pos.y, p3.pos.x, p3.pos.y) > distThreshMax || myp5.dist(p1.pos.x, p1.pos.y, p3.pos.x, p3.pos.y) < distTreshMin) {
        continue;
      }

      // Base its hue by the particle's life.
      if (useFill) {
        myp5.noStroke();
        myp5.fill(poseInstance.hue.currentValue + p1.life * 1.5, poseInstance.saturation.currentValue, 360);
      } else {
        myp5.noFill();
        myp5.stroke(poseInstance.hue.currentValue + p1.life * 1.5, poseInstance.saturation.currentValue, 360);
      }

      myp5.strokeWeight(myp5.map(poseInstance.radius.currentValue, poseInstance.radius.min, poseInstance.radius.max, 1, 4))
      myp5.push();
      myp5.scale(myp5.map(poseInstance.radius.currentValue, poseInstance.radius.min, poseInstance.radius.max, 1, 4));
      myp5.triangle(p1.pos.x, p1.pos.y,
        p2.pos.x, p2.pos.y,
        p3.pos.x, p3.pos.y);
      myp5.pop();

    }
  }

  myp5.noStroke();
  // myp5.fill(255);
}


function createParticle() {

  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;

    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      if (keypoint.score > 0.2 && partsToTrack.includes(keypoint.part)) {
        allParticles.push(new Particle(keypoint.position.x - this.windowWidth / 2, keypoint.position.y - this.windowHeight / 2, maxLevel));
      }
    }
  }
}




function keyPressed() {
  useFill = !useFill;
}