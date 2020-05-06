
export function RenderPolygon(x: number, y: number, radius: number, numPoints: number, p5: any) {
  const angle = p5.TWO_PI / numPoints;
  p5.beginShape();
  for (let a = 0; a < p5.TWO_PI; a += angle) {
    const sx = x + p5.cos(a) * radius;
    const sy = y + p5.sin(a) * radius;
    p5.vertex(sx, sy);
  }
  p5.endShape(p5.CLOSE);
}
