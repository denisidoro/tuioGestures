var interpret = require("./interpret");

var callbacks = {

	addTuioCursor: function(cursor) {
		interpret.commandLine('%enz% "a=SayTime(Microsoft Zira Desktop)"');
		callbacks.updateTuioCursor(cursor);
	},

	updateTuioCursor: function(cursor) {
		console.log([cursor.getCursorId(), cursor.getScreenX(10000)/10000, cursor.getScreenY(10000)/10000]);
	},

	removeTuioCursor: function(cursor) {
		delete[cursor.getCursorId()];
	},

	addTuioObject: function(object) {},

	updateTuioObject: function(object) {},

	removeTuioObject: function(object) {}

};

module.exports = callbacks;
