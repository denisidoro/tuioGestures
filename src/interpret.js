var shortcuts = require('../data/shortcuts.json');

var interpret = {

	commandLine: function(text) {
		for (var s in shortcuts)
		    text = text.replace("%" + s + "%", shortcuts[s]);
		this.exec(text);
	},

	exec: function(command) {
		console.log(command);
		var exec = require('child_process').exec;
		exec(command);
	}

};

module.exports = interpret;