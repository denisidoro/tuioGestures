var Recognizer = {

  recognize: function(speed, mean, fingers) {

    console.log([speed.toPrecision(3), mean.rotationAngle.toPrecision(3), mean.scaleFactor.toPrecision(3)]);

    if (speed < 0.14 || mean.rotationAngle == 0.0 || mean.ScaleFactor == 0.0)
      return false;

    var smallRotation = Math.abs(mean.rotationAngle) < 4;
    var smallScale    = Math.abs(1 - mean.scaleFactor) < 0.2;

    var rThresh = 8;
    var sThresh = 0.19;

    if      (mean.rotationAngle > rThresh && smallScale)    return "CW";
    else if (mean.rotationAngle < -rThresh && smallScale)   return "CCW";
    else if (mean.scaleFactor > 1 + sThresh)                return "PO";
    else if (mean.scaleFactor < 1 - sThresh*0.8)            return "PI";
    else if (smallScale && smallRotation)                   return "SW";

  }

}

module.exports = Recognizer;