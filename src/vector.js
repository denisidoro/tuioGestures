// This type represents a vector that starts at the beginning of the coordinate system
// and end at (x, y).
// It can also be used to represent the point (x, y).
var Vector = function (x, y) {
  this.x = x;
  this.y = y;
};

Vector.prototype.add = function (p) {
  return new Vector(this.x + p.x, this.y + p.y);
};

Vector.prototype.subtract = function (p) {
  if (Array.isArray(p)) {
    p = Vector.findCenter(p.slice(1));
  }
  return new Vector(this.x - p.x, this.y - p.y);
};

Vector.prototype.scale = function (coef) {
  return new Vector(this.x * coef, this.y * coef);
};

Vector.prototype.norm = function () {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.invertY = function() {
  this.y = -this.y;
  return this;
}

Vector.fromCursor = function (cursor) {
  return new Vector(cursor.x, cursor.y);
};

Vector.fromCursors = function(cursors) {
  var p = [];
  cursors.forEach(function(c) {
    p.push(Vector.fromCursor(c));
  })
  return p;
}

Vector.findCenter = function(p) {
  var center = new Vector(0, 0);
  p.forEach(function(pi) {
    center = center.add(pi);
  })
  return center.scale(1/p.length);
};

Vector.distance = function (p1, p2) {
  if (Array.isArray(p1)) {
    var d = 0;
    var center = Vector.findCenter(p1);
    p1.forEach(function(pi) {
      d += Vector.distance(center, pi);
    })
    return d/p1.length;
  }
  return p1.subtract(p2).norm();
};

Vector.crossProduct = function (p1, p2) {
  return p1.x * p2.y - p1.y * p2.x;
};

Vector.regressionAngle = function(p) {

	var sumX = 0, sumX2 = 0, sumY = 0, sumXY = 0;
	p.forEach(function(pi) {
		sumX 	+= pi.x;
		sumX2 	+= pi.x * pi.x;
		sumY 	+= pi.y;
		sumXY	+= pi.x * pi.y;
	})

	return Math.abs(Math.atan((sumX2 * sumY - sumXY * sumX) / (p.length * sumX2 - sumX * sumX)) * (180/3.1415));

}

module.exports = Vector;