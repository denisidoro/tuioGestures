// ------------------------------------
// Tuio client

global.Tuio = require("./Tuio/Tuio.js");
["Time", "Point", "Container", "Cursor", "Object", "Client"].forEach(function(s) {
	require("./Tuio/Tuio" + s + ".js");
})

global.client = new Tuio.Client();

// ------------------------------------
// Tuio server

server = require("./Tuio/TuioServer");
server.init({
	oscPort: 3333,
	oscHost: "localhost"
});

// ------------------------------------
// Callbacks

var callbacks = require('./src/callbacks.js')
for (var i in callbacks) {
	client.on(i, callbacks[i]);
}
