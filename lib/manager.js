'use strict';

var net = require('net');
var spawn = require('child_process').spawn;
var _ = require('lodash');

function Manager() {
    this.workers_ = [];

    var manager = this;

    this.startMessageServer();

    process.on('exit', function(code) {
        console.log("Workers registered: " + manager.workers_.length);
        console.log('Manager shutting down.');
    });
    process.on('SIGINT', function() {
        console.log('Manager told to exit.');
    });
}

Manager.prototype.launch = function(args) {
    console.log("Starting up...");

    this.startWorker();
    this.startWorker();
    this.startWorker();

    console.log("Workers registered: " + this.workers_.length);

};

Manager.prototype.startMessageServer = function() {
    this.server_ = net.createServer();
    this.server_.listen('/tmp/hasteManager.sock');
    console.log("Manager listening for clients");
};

Manager.prototype.startWorker = function() {

    var phantomJSBin = require('phantomjs').path;

    var workerScript = __dirname + '/worker.js';

    var worker = spawn(phantomJSBin, [workerScript]);

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
