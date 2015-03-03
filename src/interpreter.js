// libraries
var Recognizer = require('./recognizer');

// variables
var shortcuts = require('../data/shortcuts.json');
var actions = require("../data/actions.json");; // m: movement, a: area, n: length, c: command
var possibleActions;
var moveString = "";

// helpers
function cloneActions() {
	var r = [];
	for (var i = 0; i < actions.length; i++)
		r.push(actions[i]);
	return r;
}

function printPossibleActions(a) {
	var str = [];
	a.forEach(function(p) {
		str.push(p.m + "+" + p.n);
	});
	console.log("\n" + str.join(", ") + "\n");
}

var Interpreter = {
	
	newMovement: function(segment, length, startingCursor) {
		
		var detection = 0;
		var newString = moveString + (moveString == "" ? "" : "_") + segment;

		// print
		process.stdout.write("\u001b[2J\u001b[0;0H");
		console.log(newString + "+" + length);

		possibleActions.forEach(function(a, i) {
			//console.log([i, a.m]);
			if (a.n == length && a.m.indexOf(newString) == 0 && Recognizer.area(startingCursor, a.a)) {
				moveString = newString;
				detection++;
				return false;
			}
			else
				delete possibleActions[i]; //possibleActions = possibleActions.splice(i, 1);
		})

		printPossibleActions(possibleActions);

		if (detection)
			detection += Interpreter.totalMovement() ? 1 : 0;
		
		return detection;

	},

	totalMovement: function() {

		var found = false;

		possibleActions.forEach(function(a) {
			if (a.m == moveString) {
				console.log("\n" + (a.d ? a.d : a.c));
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

	reset: function(reloadActions) {

		moveString = "";
		possibleActions = cloneActions();

	}

};

printPossibleActions(actions);

module.exports = Interpreter;