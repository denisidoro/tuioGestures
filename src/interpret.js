var shortcuts = require('../data/shortcuts.json');
var actions = require("../data/actions.json");

var interpret = {

	move: function(current) {
		actions.forEach(function(a) {
			if (a.m.trim() == current) {
				interpret.commandLine(a.a);
				return false;
			}
		});
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
	}

};

module.exports = interpret;