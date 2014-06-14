'use strict';

var net = require('net');
var spawn = require('child_process').spawn;
var _ = require('lodash');
var Q = require('q');

function Manager() {

    var manager = this;
    this.workers_ = [];

    process.on('exit', function(code) {
        manager.shutdownMessageServer();
        //console.log("Workers registered: " + manager.workers_.length);
        //console.log('Manager shutting down, exit code: ' + code);
    });
    process.on('SIGINT', function() {
        console.log('Manager told to exit.');
    });
}

Manager.prototype.launch = function(args) {

    var numberOfWorkers = args.agents;
    var urls = args.urls;

    console.log("Starting up...");

    this.startMessageServer();

    this.startWorkers(numberOfWorkers)
        .then(function() {
            console.log("Ready to start flow steps");
        }, function (reason){
            console.log("Error: " + reason);
        });
};

Manager.prototype.startWorkers = function(numberOfWorkers) {

    var deferred = Q.defer();

    // start up the desired number of workers
    var workerPromises = [];
    var i;
    for(i = 0; i < numberOfWorkers; i++) {
        workerPromises.push( this.startWorker(i) );
    }

    // wait for all workers to start up and register
    Q.all(workerPromises).then(function() {
        console.log("All workers registered successfully");
        deferred.resolve();
    }, function() {
        deferred.reject(new Error("Unable to register all workers"));
    });

    return deferred.promise;
};

Manager.prototype.startMessageServer = function() {
    var manager = this;
    this.server_ = net.createServer(function(socket) {
        //console.log("Manager accepted client connection");
        socket.setEncoding('utf8');
        socket.on('data', function(data) {
            var message = JSON.parse(data);
            if(message.type === "register") {
                console.log('Register client: ' + JSON.stringify(message.workerIndex));
                var worker = _.find(manager.workers_, function(w){ return w.workerIndex === message.workerIndex;} );
                if(worker) {
                    worker.registerPromise.resolve();
                } else {
                    console.log("Unknown client trying to register");
                }
            } else {
                console.log("Unknown message from client");
            }
        });
    });
    this.server_.listen('/tmp/hasteManager.sock', function() {
        console.log("Manager listening for clients");
    });
};

Manager.prototype.shutdownMessageServer = function() {
    if(this.server_) {
        this.server_.close(function () {
            console.log("Manager closed message socket");
        });
    }
};

Manager.prototype.startWorker = function(workerIndex) {

    var deferred = Q.defer();
    var phantomJSBin = require('phantomjs').path;
    var workerScript = __dirname + '/worker.js';

    var worker = spawn(phantomJSBin, [workerScript, workerIndex]);

    var manager = this;

    worker.on('close', function (code) {
        var worker = this;
        //manager.server_.unref();
        _.remove(manager.workers_, {pid: worker.pid} );
        //console.log('Worker [' + this.pid + '] closing with code ' + code);
        console.log('Worker [' + this.workerIndex + '] closing.');
        if(manager.workers_.length === 0) {
            manager.server_.unref();
        }
    });
    worker.on('exit', function (code, signal) {
        //console.log('Worker [' + this.pid + '] exiting with code ' + code + ', signal ' + signal);
    });

    worker.registerPromise = deferred;
    worker.workerIndex = workerIndex;
    console.log('Launched worker: ' + workerIndex);

    this.workers_.push(worker);

    return deferred.promise;
};


module.exports = exports = new Manager();
