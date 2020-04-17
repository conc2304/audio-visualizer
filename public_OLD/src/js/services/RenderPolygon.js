
const renderPolygon = function (x, y, radius, numPoints, p5) {
  'use strict';
  const angle = p5.TWO_PI / numPoints;
  p5.beginShape();
  for (let a = 0; a < p5.TWO_PI; a += angle) {
    const sx = x + p5.cos(a) * radius;
    const sy = y + p5.sin(a) * radius;
    p5.vertex(sx, sy);
  }
  p5.endShape(p5.CLOSE);
};

export default renderPolygon;
