// Based on Vergiliev's simple-multitouch
// https://github.com/IvanVergiliev/simple-multitouch

// libraries
var Vector = require('./vector');
var Recognizer = require('./recognizer');
var Interpreter = require("./interpreter");

// variables
var mean = new (require('./mean'))();
var iteration = 0;
var lastTime; // ms
var speed; // screen % / s
var startingCursor;
var monitor = true;

var multitouch = {

  center: new Vector(0, 0),
  direction: new Vector(0, 0),
  distance: {},
  regressionAngle: 0,

  reset: function(cursors) {

    // reset global variables    
    mean.reset(center, (!cursors ? 0 : cursors.length));
    iteration = 0;
    lastTime = Date.now(); 
    speed = null;
    regressionAngle = 0;

  },

  stopMonitoring: function(msg) {

    monitor = false;
    console.log(msg || "MONITORING STOPPED");

  },

  onAddTuioCursor: function(cursors) {

    var p = Vector.fromCursors(cursors);
    center = Vector.findCenter(p);
    direction = p[0].subtract(p);
    distance = Vector.distance(p);

    this.reset(cursors);
    Interpreter.reset();

    if (cursors.length == 1) {
        startingCursor = cursors[0];
        monitor = true;
    }

  },

  onRemoveTuioCursor: function(length) {

    this.reset();
    Interpreter.reset();

    if (length == 0)
        startingCursor = null;

  },

  onUpdateTuioCursor: function(cursors) {

    iteration++;
    if (iteration < 11 || !monitor)
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
        var rotationAngle = (newRegressionAngle - regressionAngle) * (2.1*cursors.length - 3.2);
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
    distance = newDistance;
    regressionAngle = newRegressionAngle;
    lastTime = now;

    var move = Recognizer.recognize(speed, mean, cursors.length)
    if (move) {
        var detection = Interpreter.newMovement(move[1], cursors.length, startingCursor)
        if (detection > 0) {
            this.reset();
            if (detection > 1)
                this.stopMonitoring("MOVEMENT FOUND");
        }
        else if (move[0] == "swipe")
            this.stopMonitoring("NO POSSIBLE MOVEMENTS");
    }

  }

}

module.exports = multitouch;