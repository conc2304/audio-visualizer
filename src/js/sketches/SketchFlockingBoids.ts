// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com
// Boid class

import P5 from 'p5';

// Methods for Separation, Cohesion, Alignment added
export class Boid {
  constructor (x: number, y: number, myP5: P5) {
    this.acceleration = myP5.createVector(0, 0);
    this.velocity = myP5.createVector(myP5.random(-1, 1), myP5.random(-1, 1));
    // if (flipHorizontal) {
    // this.position = myp5.createVector(-x, y);
    // }
    // else {
    this.position = myP5.createVector(x, y);
    // }
    this.myP5 = myP5;
    this.boidSize = 10;
    this.maxSpeed = 3; // Maximum speed
    this.maxForce = 2; // Maximum steering force .8
    this.desiredSeparation = 1;
  }

  private myP5: P5;
  private velocity: P5.Vector;
  private position: P5.Vector;

  public acceleration: P5.Vector;
  public boidSize: number;
  public maxSpeed: number;
  public maxForce: number;
  public desiredSeparation: number;
  public targetPos: P5.Vector = new P5.Vector().add(0, 0, 0);


  // Public Methods
  public run(boids: Array<Boid>) {
    this.flock(boids);
    this.updateBoid();
    this.boidBorders();
    this.renderBoid();
  }


  private applyForce(force: P5.Vector) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  // We accumulate a new acceleration each time based on three rules
  private flock(boids: Array<Boid>) {
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
  private updateBoid() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    // Reset accelerstion to 0 each cycle
    this.acceleration.mult(0);
  }

  // A method that calculates and applies a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  private seekBoid(target): P5.Vector {
    // const nearestTarget = this.getNearestTarget(this.position);

    const homingDirection = this.myP5.createVector(this.targetPos.x, this.targetPos.y);
    //   let homingDirection = myp5.createVector(myp5.mouseX, myp5.mouseY);
    const desired = P5.Vector.sub(homingDirection, this.position); // A vector pointing from the location to the target
    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(this.maxSpeed);
    // Steering = Desired minus Velocity
    const steer = P5.Vector.sub(desired, this.velocity);
    // this.maxForce = this.myP5.map(poseDetectionInstance.magnitude.currentValue, poseDetectionInstance.magnitude.min, poseDetectionInstance.magnitude.min, 0.03, 1);
    steer.limit(this.maxForce); // Limit to maximum steering force
    return steer;
  }

  private renderBoid(): void {
    // this.boidSize = this.myP5.map(poseDetectionInstance.radius.currentValue, poseDetectionInstance.radius.min, poseDetectionInstance.radius.max, 1, 30, true);
    // Draw a triangle rotated in the direction of velocity
    let theta = this.velocity.heading() + this.myP5.radians(90);
    // this.myP5.noFill();
    // this.myP5.stroke('red');
    // this.myP5.strokeWeight(2);
    this.myP5.push();
    this.myP5.translate(this.position.x, this.position.y, -10);
    this.myP5.rotate(theta);
    // this.myP5.beginShape();
    // this.myP5.vertex(0, -this.boidSize * 2);
    // this.myP5.vertex(-this.boidSize, this.boidSize * 5);
    // this.myP5.vertex(this.boidSize, this.boidSize * 5);
    // this.myP5.endShape(this.myP5.CLOSE);


    this.myP5.normalMaterial();

    this.myP5.scale(this.boidSize * 0.07);
    this.myP5.model(this.myP5?.[ 'objects' ][ 'lambo' ]);
    this.myP5.pop();
  }

  // Wraparound
  private boidBorders(): void {
    // if (this.position.x < -this.boidSize)
    //   this.position.x = this.myP5.width + this.boidSize;
    // if (this.position.y < -this.boidSize)
    //   this.position.y = this.myP5.height + this.boidSize;
    // if (this.position.x > this.myP5.width + this.boidSize)
    //   this.position.x = -this.boidSize;
    // if (this.position.y > this.myP5.height + this.boidSize)
    //   this.position.y = -this.boidSize;
  }

  // Separation
  // Method checks for nearby boids and steers away
  private separateBoids(boids: Array<Boid>) {
    let steer = this.myP5.createVector(0, 0);
    let count = 0;
    // For every boid in the system, check if it's too close
    for (let i = 0; i < boids.length; i++) {
      let d = P5.Vector.dist(this.position, boids[ i ].position);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if (d > 0 && d < this.desiredSeparation) {
        // Calculate vector pointing away from neighbor
        let diff = P5.Vector.sub(this.position, boids[ i ].position);
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
      steer.mult(this.maxSpeed);
      steer.sub(this.velocity);
      steer.limit(this.maxForce);
    }
    return steer;
  }

  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  private alignBoids(boids: Array<Boid>) {
    let neighborDist = 30;
    let sum = this.myP5.createVector(0, 0);
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = P5.Vector.dist(this.position, boids[ i ].position);
      if (d > 0 && d < neighborDist) {
        sum.add(boids[ i ].velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxSpeed);
      let steer = P5.Vector.sub(sum, this.velocity);
      steer.limit(this.maxForce);
      return steer;
    }
    else {
      let vector = new P5.Vector();
      vector.set(0, 0, 0);
      return vector;
    }
  }

  // Cohesion
  // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
  private boidCohesion(boids: Array<Boid>) {
    let neighborDist = 30;
    let sum = this.myP5.createVector(0, 0); // Start with empty vector to accumulate all locations
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = P5.Vector.dist(this.position, boids[ i ].position);
      if (d > 0 && d < neighborDist) {
        sum.add(boids[ i ].position); // Add location
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seekBoid(sum); // Steer towards the location
    }
    else {
      return this.myP5.createVector(0, 0);
    }
  }
}

export class Flock {
  constructor (targetPos: P5.Vector) {
    // An array for all the boids
    this.boids = []; // Initialize the array
    this.targetPos = targetPos;
  }

  public boids: Array<Boid> = [];
  public targetPos: P5.Vector;

  public run() {
    for (let i = 0; i < this.boids.length; i++) {
      this.boids[ i ].targetPos = this.targetPos;
      this.boids[ i ].run(this.boids); // Passing the entire list of boids to each boid individually
    }
  }

  public addBoid(b) {
    this.boids.push(b);
  }
}


