var Recognizer = require('./recognizer');

var shortcuts = require('../data/shortcuts.json');
var actions = require("../data/actions.json");	// m: movement, a: area, n: length, c: command
var moveString = "";

var Interpreter = {
	
	newMovement: function(segment, length, startingCursor) {
		
		var detection = 0;
		var newString = moveString + (moveString == "" ? "" : "_") + segment;

		actions.forEach(function(a) {
			//console.log("\t" + newString + ",\t" + a.m + ",\t(" + [a.n == length, a.m.indexOf(newString) == 0, Recognizer.area(startingCursor, a.a), moveString].join(", ") + ")");
			if (a.n == length && a.m.indexOf(newString) == 0 && Recognizer.area(startingCursor, a.a)) {
				//console.log("MATCH: " + a.m);
				moveString = newString;
				detection++;
				return false;
			}
		})

		//console.log(moveString);
		//console.log([segment, newString, moveString]);
		if (detection)
			detection += Interpreter.totalMovement() ? 1 : 0;
		
		return detection;

	},

	totalMovement: function() {

		var found = false;

		actions.forEach(function(a) {
			if (a.m == moveString) {
				//console.log(a.m);
				console.log(a.m + "\t" + (a.d ? a.d : a.c));
				Interpreter.commandLine(a.c);
				found = true;
				return false;
			}
		})

		return found;

	},

	commandLine: function(text) {
		for (var s in shortcuts)
		    text = text.replace("%" + s + "%", shortcuts[s]);
		this.exec(text);
	},

	exec: function(command) {
		//console.log(command);
		var exec = require('child_process').exec;
		exec(command);
	},

	reset: function() {
		moveString = "";
	}

};

module.exports = Interpreter;