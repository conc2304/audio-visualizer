import p5 from 'p5';


export const polygons = [ 'line', 'triangle', 'square', 'pentagon' ]; // polygons we are allowing for set in the shape attribute

/**
 * Renders a given shape along the the passed x and y positions.
 */
export function render2DShape(p5: p5, xPos: number, yPos: number, radius: number, shape: string) {
  // console.log('HERE');
  p5.push();
  if (shape === 'ellipse') {
    p5.ellipse(xPos, yPos, radius, radius);
  } else if (polygons.includes(shape)) {

    const sideMap = {
      line: 2,
      triangle: 3,
      square: 4,
      pentagon: 5,
    };
    const sides = sideMap?.[ shape ] ?? 3;

    p5.translate(xPos, yPos);
    // p5.rotate(p5.sin(p5.frameCount / 50.0));
    p5[ 'polygon' ](0, 0, radius, sides, p5);
  } else {
    p5.ellipse(xPos, yPos, radius, radius);
  }
  p5.pop();
};

/**
 * Based on user toggling, set the color profile for element to be rendered
 */
export function setColor(p5: p5, mode: string, hue: number, saturation: number) {
  switch (mode) {
    case 'Outline':
      p5.strokeWeight(1);
      p5.stroke(hue, saturation, 100);
      p5.noFill();
      break;
    case 'Filled':
      p5.noStroke();
      p5.fill(hue, saturation, 100);
      break;
  }
};

/**
 * Sets the rotational speed along the X, Y, and Z axis of each shape
 */
export const rotateShape = (p5, props) => {

  const { rotateXVelocity, rotateX, rotateYVelocity, rotateY, rotateZVelocity, rotateZ } = props;
  p5.push();
  p5.rotateX(
    p5.frameCount *
    (rotateXVelocity ? rotateXVelocity : 0) +
    rotateX,
  );
  p5.rotateY(
    p5.frameCount *
    (rotateYVelocity ? rotateYVelocity : 0) +
    rotateY,
  );
  p5.rotateZ(
    p5.frameCount *
    (rotateZVelocity ? rotateZVelocity : 0) +
    rotateZ,
  );
  p5.pop();
};
