// libraries
var Recognizer = require('./recognizer');

// variables
var shortcuts = require('../data/shortcuts.json');
var actions; // m: movement, a: area, n: length, c: command
var moveString = "";

var Interpreter = {
	
	newMovement: function(segment, length, startingCursor) {
		
		var detection = 0;
		var newString = moveString + (moveString == "" ? "" : "_") + segment;

		actions.forEach(function(a, i) {
			if (a.n == length && a.m.indexOf(newString) == 0 && Recognizer.area(startingCursor, a.a)) {
				moveString = newString;
				detection++;
				return false;
			}
			else
				actions.slice(i, 1);
		})

		if (detection)
			detection += Interpreter.totalMovement() ? 1 : 0;
		
		return detection;

	},

	totalMovement: function() {

		var found = false;

		actions.forEach(function(a) {
			if (a.m == moveString) {
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
		var exec = require('child_process').exec;
		exec(command);
	},

	reset: function() {
		moveString = "";
		actions = require("../data/actions.json");
	}

};

module.exports = Interpreter;