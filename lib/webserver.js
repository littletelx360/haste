'use strict';

var connect = require('connect');
var http = require('http');
var st = require('st');
var Q = require('q');

function WebServer() {
    var self = this;
    process.on('exit', function(code) {
        console.log('Exiting...');
    });

    process.on ('SIGTERM', this.gracefulShutdown.bind(this));
    process.on ('SIGINT', this.gracefulShutdown.bind(this));
}

WebServer.prototype.gracefulShutdown = function() {
    var self = this;

    console.log("Shutting down ");

    self.shutdownServer().then(function() {
        console.log('\nShut down web server.');
        process.exit(0);
    }, function() {
        console.log('\nKilling web server.');
        process.exit(0);
    });

};

WebServer.prototype.launch = function(args) {

    var port = args.port;
    var compression = args.compression;

    var mount = st({
        path: process.cwd(),
        url: '/',
        index: false,
        dot: false,
        passthrough: false,
        gzip: compression
    });

    var app = connect()
        .use(connect.logger(':remote-addr :method :url :status'))
        .use(connect.responseTime())
        .use(mount);

    this.webServer_ = http.createServer(app).listen(port);
    console.log('Starting Web Server on port: ' + port);
    console.log('  Compression: ' + compression);
    console.log('  Folder: ' + process.cwd());
};

WebServer.prototype.shutdownServer = function() {
    var deferred = Q.defer();
    if(this.webServer_) {
        this.webServer_.close(function() {
            deferred.resolve();
        });
    } else {
        deferred.resolve();
    }
    return deferred.promise.timeout(1000);
};


module.exports = exports = new WebServer();
