import p5 from 'p5';

const renderPolygon = function (x, y, radius, numPoints) {
  'use strict';
  const angle = p5.TWO_PI / numPoints;
  p5.beginShape();
  for (let a = 0; a < p5.TWO_PI; a += angle) {
    let sx = x + p5.cos(a) * radius;
    let sy = y + p5.sin(a) * radius;
    p5.vertex(sx, sy);
  }
  p5.endShape(p5.CLOSE);
};

export default renderPolygon;
