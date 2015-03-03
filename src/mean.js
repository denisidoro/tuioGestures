var Mean = function() {
  this.reset();
};

Mean.prototype.update = function(scaleFactor, rotationAngle, angle) {

  this.samples += 1;

  this.scaleFactor = (this.scaleFactor * (this.samples - 1) + scaleFactor) / this.samples;
  this.rotationAngle = (this.rotationAngle * (this.samples - 1) + rotationAngle) / this.samples;

  if (Math.abs(angle - this.angle) > 180)
    angle += (angle > 180 ? -1 : 1) * 360; 
  this.angle = (this.angle * (this.samples - 1) + angle) / this.samples;
  if (this.angle < 0) this.angle += 360;
  else if (this.angle > 360) this.angle -= 360;

}

Mean.prototype.reset = function() {
  this.samples = 0;
  this.scaleFactor = 0;
  this.rotationAngle = 0;
  this.angle = 0;
}

module.exports = Mean;