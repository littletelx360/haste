'use strict';


var net = require('net');

var client = net.connect({path: '/tmp/hasteManager.sock'}, function() {
    client.write("Hello from client");
});

process.on('exit', function(code) {
    client.unref();
});

process.on('SIGINT', function() {
    console.log('Worker-Client told to exit. SIGINT');
});

process.on('SIGTERM', function() {
    console.log('Worker-Client told to exit. SIGTERM');
});