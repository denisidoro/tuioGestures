var mt = require("./multitouch");

var cursors = [];

var callbacks = {

	addTuioCursor: function(cursor) {
		//console.log('add');
		cursors[cursor.getCursorId()] = {
			id: cursor.getCursorId(),
			x: cursor.getScreenX(10000)/10000,
			y: cursor.getScreenY(10000)/10000
		};
		mt.onAddTuioCursor(cursors);
		callbacks.updateTuioCursor(cursor);
	},

	updateTuioCursor: function(cursor) {
		var c = cursors[cursor.getCursorId()];
		if (!c) return false;
		c.x = cursor.getScreenX(10000)/10000;
		c.y = cursor.getScreenY(10000)/10000;
		//console.log(c);
		mt.onUpdateTuioCursor(cursors);
	},

	removeTuioCursor: function(cursor) {
		cursors.splice(cursor.getCursorId(), 1);
		delete[cursor.getCursorId()];
		mt.onRemoveTuioCursor();
	},

	addTuioObject: function(object) {},

	updateTuioObject: function(object) {},

	removeTuioObject: function(object) {}

};

module.exports = callbacks;
