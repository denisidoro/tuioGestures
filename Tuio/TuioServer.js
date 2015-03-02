module.exports = (function() {
    var dgram = require("dgram"),
    udpSocket = null,
    io = null,
    oscParser = require("./OscParser"),

    init = function(params) {
        udpSocket = dgram.createSocket("udp4");
        udpSocket.on("listening", onSocketListening);
        udpSocket.bind(params.oscPort, params.oscHost);


        udpSocket.on("message", function(msg) {
            client.acceptBundle(oscParser.decode(msg));
        });

    },

    onSocketListening = function() {
        var address = udpSocket.address();
        console.log("TuioServer listening on: " + address.address + ":" + address.port);
    },

    onSocketConnection = function(socket) {
        udpSocket.on("message", function(msg) {
            socket.emit("osc", oscParser.decode(msg));
        });
    };

    return {
        init: init
    };
}());