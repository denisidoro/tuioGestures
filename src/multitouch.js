// Based on Vergiliev's simple-multitouch
// https://github.com/IvanVergiliev/simple-multitouch

// libraries
var Vector = require('./vector');
var Recognizer = require('./recognizer');
var Interpreter = require("./interpreter");

// variables
var moveString = "";
var mean = new (require('./mean'))();
var iteration = 0;
var lastTime; // ms
var speed; // screen % / s

var multitouch = {

  center: new Vector(0, 0),
  direction: new Vector(0, 0),
  distance: {},
  regressionAngle: 0,

  onAddTuioCursor: function(cursors) {

    var p = Vector.fromCursors(cursors);
    center = Vector.findCenter(p);
    direction = p[0].subtract(p);
    distance = Vector.distance(p);
    regressionAngle = 0;

    // reset global variables    
    mean.reset(center, cursors.length);
    iteration = 0;
    lastTime = Date.now(); 
    speed = null;

  },

  onUpdateTuioCursor: function(cursors) {

    iteration++;
    if (iteration < 11)// && !regressionAngle)
        return false;
    iteration = 0;
    
    var p = Vector.fromCursors(cursors);

    // Calculate the center of mass and the distance it has travelled from its previous position.
    var newCenter = Vector.findCenter(p);
    var deltaVector = newCenter.subtract(center).invertY();

    // Calculate the distance and how much larger it is than the previous distance.
    var newDistance = Vector.distance(p);

    if (cursors.length > 1) {

        var scaleFactor = Math.pow(newDistance / distance, 0.5*cursors.length + 0);
        var newRegressionAngle = Vector.regressionAngle(p);
        //console.log([newRegressionAngle.toPrecision(3), regressionAngle.toPrecision(3), mean.rotationAngle.toPrecision(3)])
        var rotationAngle = (newRegressionAngle - regressionAngle) * (2.1*cursors.length - 3.2);

        /*// Finally, calculate the vector with endpoints at the fingers, and find the angle it has
        // been rotated by.
        var newDirection = p[0].subtract(p);
        var crossProduct = Vector.crossProduct(direction, newDirection);

        // We use the fact that cp(a, b) = ||a|| * ||b|| * sin(theta), where theta is the angle between
        // vectors a and b, to find theta.
        var normalizedCrossProduct = crossProduct / (direction.norm() * newDirection.norm());
        var rotationAngle = Math.asin(normalizedCrossProduct);*/

    }

    var angle = Math.atan2(deltaVector.y, deltaVector.x) * 180/3.1415;
    if (angle < 0) angle += 360;

    // Don't update the mean if there are undefined variables
    if (angle != 0.0 && regressionAngle != 0)
        mean.update(scaleFactor, rotationAngle, angle);

    var now = Date.now();
    if (lastTime)
        speed = deltaVector.norm() / (now - lastTime) * 1000;

    center = newCenter;
    //direction = newDirection;
    distance = newDistance;
    regressionAngle = newRegressionAngle;
    lastTime = now;

    //console.log(mean.rotationAngle);

    var segment = Recognizer.recognize(speed, mean)
    if (segment) {
        console.log(segment);
        moveString += (moveString == "") ? "" : "_" + segment;
        //Interpreter.move(mean);
    }

  }

}

module.exports = multitouch;