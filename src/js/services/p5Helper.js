
const p5Helper = {};

/**
 * Renders a given shape along the the passed x and y positions.
 * @param xPos
 * @param yPos
 * @param radius
 */
p5Helper.renderShape = function(p5, xPos, yPos, radius) {
  const polygons = ['line', 'triangle', 'square', 'pentagon']; // polygons we are allowing for set in the shape attribute

  p5.push();
  if (this.shape.currentValue === 'ellipse') {
    p5.ellipse(xPos, yPos, radius, radius);
  } else if (polygons.includes(this.shape.currentValue)) {
    let sides = 2;


    switch (this.shape.currentValue) {
      case 'line':
        sides = 2;
        p5.strokeWeight(2);
        break;
      case 'triangle':
        sides = 3;
        break;
      case 'square':
        sides = 4;
        break;
      case 'pentagon':
        sides = 5;
        break;
    }

    p5.translate(xPos, yPos);
    // p5.rotate(p5.sin(p5.frameCount / 50.0));
    p5.polygon(0, 0, radius, sides, p5);
  } else {
    p5.ellipse(xPos, yPos, radius, radius);
  }
  p5.pop();
};

/**
 * Based on user toggling, set the color profile for element to be rendered
 */
p5Helper.setColor = function(p5) {
  switch (this.stroke.currentValue) {
    case 'Outline':
      p5.strokeWeight(1);
      p5.stroke(this.hue.currentValue, this.saturation.currentValue, 100);
      p5.noFill();
      break;
    case 'Filled':
      p5.noStroke();
      p5.fill(this.hue.currentValue, this.saturation.currentValue, 100);
      break;
  }
};

/**
 * Sets the rotational speed along the X, Y, and Z axis of each shape
 */
p5Helper.rotateShape = function(p5) {
  p5.push();
  p5.rotateX(
    p5.frameCount * (this.rotateXVelocity ? this.rotateXVelocity.currentValue : 0) +
      this.rotateX.currentValue,
  );
  p5.rotateY(
    p5.frameCount * (this.rotateYVelocity ? this.rotateYVelocity.currentValue : 0) +
      this.rotateY.currentValue,
  );
  p5.rotateZ(
    p5.frameCount * (this.rotateZVelocity ? this.rotateZVelocity.currentValue : 0) +
      this.rotateZ.currentValue,
  );
  p5.pop();
};

export default p5Helper;
