var shortcuts = require('../data/shortcuts.json');
var actions = require("../data/actions.json");
var moveString = "";

var Interpreter = {

	// moveString: function() {
	// 	actions.forEach(function(a) {
	// 		if (a.m.trim() == mean.string) {
	// 			Interpreter.commandLine(a.a);
	// 			return false;
	// 		}
	// 	});
	// },
	
	newMovement: function(segment) {
		
		var changed = false;
		var newString = moveString + (moveString == "" ? "" : "_") + segment;

		actions.forEach(function(a) {
			console.log("\t" + newString + ", \t" + a.m);
			if (a.m.indexOf(newString) == 0) {
				moveString = newString;
				changed = true;
				return false;
			}
		})

		console.log([segment, newString, moveString]);
		Interpreter.totalMovement();

		return changed;

	},

	totalMovement: function() {

		actions.forEach(function(a) {
			if (a.m.trim() == moveString) {
				Interpreter.commandLine(a.a);
				return false;
			}
		})

	},

	commandLine: function(text) {
		for (var s in shortcuts)
		    text = text.replace("%" + s + "%", shortcuts[s]);
		this.exec(text);
	},

	exec: function(command) {
		console.log(command);
		var exec = require('child_process').exec;
		//exec(command);
	},

	reset: function() {
		moveString = "";
	}

};

module.exports = Interpreter;