'use strict';

var net = require('net');

var args = process.argv;
var workerIndex = parseInt(args[2], 10);

var client = net.connect({path: '/tmp/hasteManager.sock'}, function() {
    //client.write("Hello from client: " + workerIndex);
    client.write(JSON.stringify({type: "register", workerIndex: workerIndex}));
});

process.on('exit', function(code) {
    client.unref();
});

process.on('SIGINT', function() {
    console.log('Worker-Client told to exit. SIGINT');
    process.exit(0);
});

process.on('SIGTERM', function() {
    console.log('Worker-Client told to exit. SIGTERM');
    process.exit(0);
});
