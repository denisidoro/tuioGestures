// variables
var zones = setZones();
var directions = "R,UR,U,UL,L,DL,D,DR".split(",");

// set zones
function setZones() {

  var z = [];
  alpha = 7;
  
  for (var i = 0; i < 4; i++) {
    z[2*i]    = 45 + 90*i - (alpha/2);
    z[2*i+1]  = 45 + 90*i + (alpha/2);
  }
  
  return z;

}

var Recognizer = {

  recognize: function(speed, mean, fingers) {

    //console.log([speed.toPrecision(3), mean.rotationAngle.toPrecision(3), mean.scaleFactor.toPrecision(3), mean.angle]);

    if (speed < 0.14 || (mean.rotationAngle == 0.0 || mean.ScaleFactor == 0.0 && fingers > 1))
      return false;

    var smallRotation = fingers == 1 || Math.abs(mean.rotationAngle) < 4;
    var smallScale    = fingers == 1 || Math.abs(1 - mean.scaleFactor) < 0.2;

    var rThresh = 8;
    var sThresh = 0.19;

    if      (mean.rotationAngle > rThresh && smallScale)    return ["rototation", "CW"];
    else if (mean.rotationAngle < -rThresh && smallScale)   return ["rotation",   "CCW"];
    else if (mean.scaleFactor > 1 + sThresh)                return ["pinch",      "PO"];
    else if (mean.scaleFactor < 1 - sThresh*0.8)            return ["pinch",      "PI"];
    else if (smallScale && smallRotation)                   return ["swipe",      Recognizer.direction(mean.angle)];

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

  },

  area: function(cursor, area) {

    function isInsideRectangle(point, topLeft, bottomRight) {
      return (point.x >= topLeft[0] && point.x <= bottomRight[0] && point.y >= topLeft[1] && point.y <= bottomRight[1]); 
    }

    var areas = {
       "R":   [ [.5, 0],  [1, 1]    ],
       "TR":  [ [.5, 0],  [1, .5]   ],
       "T":   [ [0, 0],   [1, .5]   ],
       "TL":  [ [0, 0],   [.5, .5]  ],
       "L":   [ [0, 0],   [.5, 1]   ],
       "BL":  [ [0, 0],   [.5, .5]  ],
       "B":   [ [0, .5],  [1, 1]    ],
       "BR":  [ [.5, .5], [1, 1]    ]
    };

    if (!area || area == "ANY")
      return true;
    else if (area in areas)
      return isInsideRectangle(cursor, areas[area][0], areas[area][1]);
    else if (area.indexOf(",") > -1) {
      var a = area.split(",");
      return isInsideRectangle(cursor, [a[0], a[1]], [a[2], a[3]]);
    }

    return false;        

  }

}

// Test
// var a = [6, 8, 45];
// a.forEach(function(e) {
//   console.log(Recognizer.direction(e));
// })

module.exports = Recognizer;