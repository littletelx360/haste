'use strict';

var net = require('net');
var spawn = require('child_process').spawn;
var _ = require('lodash');

function Manager() {

    var manager = this;
    this.workers_ = [];
    this.startMessageServer();

    process.on('exit', function(code) {
        manager.shutdownMessageServer();
        console.log("Workers registered: " + manager.workers_.length);
        console.log('Manager shutting down, exit code: ' + code);
    });
    process.on('SIGINT', function() {
        console.log('Manager told to exit.');
    });
}

Manager.prototype.launch = function(args) {

    var i;
    var numberOfWorkers = args.agents;

    console.log("Starting up...");

    for(i = 0; i < numberOfWorkers; i++) {
        this.startWorker(i);
    }

    console.log("Workers registered: " + this.workers_.length);
};

Manager.prototype.startMessageServer = function() {
    this.server_ = net.createServer(function(socket) {
        console.log("Manager accepted client connection");
        socket.setEncoding('utf8');
        socket.on('data', function(data) {
            console.log(data);
        });
    });
    this.server_.listen('/tmp/hasteManager.sock', function() {
        console.log("Manager listening for clients");
    });
};
Manager.prototype.shutdownMessageServer = function() {
    this.server_.close(function() {
        console.log("Manager closed message socket");
    });
};

Manager.prototype.startWorker = function(workerIndex) {

    var phantomJSBin = require('phantomjs').path;

    var workerScript = __dirname + '/worker.js';

    var worker = spawn(phantomJSBin, [workerScript, workerIndex]);

    var manager = this;

    worker.on('close', function (code) {
        var worker = this;
        manager.server_.unref();
        _.remove(manager.workers_, {pid: worker.pid} );
        console.log('Worker [' + this.pid + '] closing with code ' + code);
    });
    worker.on('exit', function (code, signal) {
        //console.log('Worker [' + this.pid + '] exiting with code ' + code + ', signal ' + signal);
    });

    console.log('Launched worker: [' + worker.pid + ']');

    this.workers_.push(worker);
};


module.exports = exports = new Manager();
