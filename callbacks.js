module.exports = {

	addTuioCursor: function() {
		//var exec = require('child_process').exec;
		//exec('notepad');
	},

	updateTuioCursor: function(updateCursor) {
		console.log([updateCursor.getCursorId(), updateCursor.getScreenX(10000)/10000, updateCursor.getScreenY(10000)/10000]);
	},

	removeTuioCursor: function() {},

	addTuioObject: function() {},

	updateTuioObject: function() {},

	removeTuioObject: function() {}

};