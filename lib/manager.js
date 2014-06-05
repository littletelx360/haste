'use strict';

var spawn = require('child_process').spawn;
var _ = require('lodash');

function Manager() {
    this.workers_ = [];

    var manager = this;

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

Manager.prototype.startWorker = function() {

    var phantomJS = __dirname + '/../node_modules/phantomjs//bin/phantomjs';
    var workerScript = __dirname + '/worker.js';

    var worker = spawn(phantomJS, [workerScript]);

    var manager = this;

    worker.on('close', function (code) {
        var worker = this;
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
