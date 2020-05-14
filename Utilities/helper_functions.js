export const sameSign = (a, b) => (a * b) > 0

export function lineIntersect (x1, y1, x2, y2, x3, y3, x4, y4) {
  var a1, a2, b1, b2, c1, c2
  var r1, r2, r3, r4
  var denom

  // Compute a1, b1, c1, where line joining points 1 and 2
  // is "a1 x + b1 y + c1 = 0".
  a1 = y2 - y1
  b1 = x1 - x2
  c1 = (x2 * y1) - (x1 * y2)

  // Compute r3 and r4.
  r3 = ((a1 * x3) + (b1 * y3) + c1)
  r4 = ((a1 * x4) + (b1 * y4) + c1)

  // Check signs of r3 and r4. If both point 3 and point 4 lie on
  // same side of line 1, the line segments do not intersect.
  if ((r3 !== 0) && (r4 !== 0) && sameSign(r3, r4)) {
    return 0 // return that they do not intersect
  }

  // Compute a2, b2, c2
  a2 = y4 - y3
  b2 = x3 - x4
  c2 = (x4 * y3) - (x3 * y4)

  // Compute r1 and r2
  r1 = (a2 * x1) + (b2 * y1) + c2
  r2 = (a2 * x2) + (b2 * y2) + c2

  // Check signs of r1 and r2. If both point 1 and point 2 lie
  // on same side of second line segment, the line segments do
  // not intersect.
  if ((r1 !== 0) && (r2 !== 0) && (sameSign(r1, r2))) {
    return 0 // return that they do not intersect
  }

  // Line segments intersect: compute intersection point.
  denom = (a1 * b2) - (a2 * b1)

  if (denom === 0) {
    return 1 // collinear
  }

  // lines_intersect
  return 1 // lines intersect, return true
}

export async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

export function getLength (number) {
  if (!number) return 1
  return number.toString().length
}


export var piyg = d3.scaleOrdinal(d3.schemePastel2);

export function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export function createRandomPointOnCircumference (center, radius) {
  var angle = Math.random() * Math.PI * 2
  var x = Math.cos(angle) * Math.random() * radius
  var y = Math.sin(angle) * Math.random() * radius
  return [center[0] + x, center[1] + y]
}

export function arraysEqual (a, b) {
  if (a === b) return true
  if (a === null || b === null) return false
  if (a.length !==b.length) return false

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false
  }
  return true
}

export function getAllNumbersInString(str) {
  var regex = /[+-]?\d+(?:\.\d+)?/g;
  var array = []
  var match;
  while (match = regex.exec(str)) {
    array.push(parseFloat(match[0]))
  }
  if (array.length === 0) return Array.from(Array(10).keys())
  else return array 
}

export function getBoundingBox(html_node, margin) { //takes a html node as param
  var bbox = html_node.getBBox()
  margin = 100
  var bounds = [
    [bbox.x - margin, bbox.y - margin],
    [bbox.x + bbox.width + margin, bbox.y + bbox.height + margin]
  ]

  return bounds;
}

export function getPositionOutsideAllElementsBBox() {
  var bounds = getBoundingBox(d3.selectAll('.everything').node())

  var x = bounds[0][0]
  var y = bounds[0][1]
  // think of the perimeter of the BBox as a line and find random point on line
  var dx = bounds[1][0] - bounds[0][0]
  var dy = bounds[1][1] - bounds[0][1]
  var perim_len = dx*2 + dy*2

  var point_on_perim_line = Math.floor(Math.random()*perim_len)

  //position.x = bounds[0][0]
  if (point_on_perim_line < dx) return [x + point_on_perim_line, y]
  point_on_perim_line -= dx
  if (point_on_perim_line < dy) return [dx + x, y + point_on_perim_line]
  point_on_perim_line -= dy
  if (point_on_perim_line < dx) return [dx - point_on_perim_line, dy + y]
  point_on_perim_line -= dx
  if (point_on_perim_line < dy) return [x, dy + y - point_on_perim_line]
}