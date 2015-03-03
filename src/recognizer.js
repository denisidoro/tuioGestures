var zones = setZones();
var directions = "R,UR,U,UL,L,DL,D,DR".split(",");

function setZones() {

  var z = [];
  alpha = 15;
  
  for (var i = 0; i < 4; i++) {
    z[2*i]    = 45 + 90*i - (alpha/2);
    z[2*i+1]  = 45 + 90*i + (alpha/2);
  }
  
  return z;

}

console.log(zones);

var Recognizer = {

  recognize: function(speed, mean, fingers) {

    //console.log([speed.toPrecision(3), mean.rotationAngle.toPrecision(3), mean.scaleFactor.toPrecision(3), mean.angle]);

    if (speed < 0.14 || (mean.rotationAngle == 0.0 || mean.ScaleFactor == 0.0 && fingers > 1))
      return false;

    var smallRotation = fingers == 1 || Math.abs(mean.rotationAngle) < 4;
    var smallScale    = fingers == 1 || Math.abs(1 - mean.scaleFactor) < 0.2;

    var rThresh = 8;
    var sThresh = 0.19;

    if      (mean.rotationAngle > rThresh && smallScale)    return "CW";
    else if (mean.rotationAngle < -rThresh && smallScale)   return "CCW";
    else if (mean.scaleFactor > 1 + sThresh)                return "PO";
    else if (mean.scaleFactor < 1 - sThresh*0.8)            return "PI";
    else if (smallScale && smallRotation)                   return Recognizer.direction(mean.angle);

    return false;

  },

  direction: function(theta) {

    if (theta < 0)
      theta += 360;

    while (theta >= 360 + zones[0])
      theta -= 360;

    for (var i = 7; i >= 0; i--) {
      if (theta >= zones[i])
        return directions[(i + 1) % directions.length];
    }

    return directions[0];

  }

}

// Test
// var a = [6, 8, 45];
// a.forEach(function(e) {
//   console.log(Recognizer.direction(e));
// })

module.exports = Recognizer;