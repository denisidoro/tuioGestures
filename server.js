var express = require("express");

global.Tuio = require("./Tuio/Tuio.js");
var sub = ["Time", "Point", "Container", "Cursor", "Object", "Client"];
sub.forEach(function(s) {
	require("./Tuio/Tuio" + s + ".js");
})

global.client = new Tuio.Client();

client.on("updateTuioCursor", onUpdateTuioCursor);

function onUpdateTuioCursor(updateCursor) {
	console.log([updateCursor.getCursorId(), updateCursor.getScreenX(10000)/10000, updateCursor.getScreenY(10000)/10000]);
}

server = require("./Tuio/TuioServer"),

app = express.createServer();
app.use(express["static"](__dirname + "/../"));
app.listen(5000);

server.init({
	oscPort: 3333,
	oscHost: "127.0.0.1",
	socketPort: app
});
