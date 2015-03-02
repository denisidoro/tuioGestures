// ------------------------------------
// Tuio client

global.Tuio = require("./Tuio/Tuio.js");
var sub = ["Time", "Point", "Container", "Cursor", "Object", "Client"];
sub.forEach(function(s) {
	require("./Tuio/Tuio" + s + ".js");
})

global.client = new Tuio.Client();

// ------------------------------------
// Tuio server

server = require("./Tuio/TuioServer");
server.init({
	oscPort: 3333,
	oscHost: "127.0.0.1"
});

// ------------------------------------
// Callbacks

var callbacks = require('./callbacks.js')
for (var i in callbacks) {
	client.on(i, callbacks[i]);
}
