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
    process.on('SIGINT', function() {
        self.shutdownServer().then(function() {
            console.log('\nShut down web server.');
            process.exit(0);
        });
    });
}

WebServer.prototype.launch = function(args) {

    var port = args.port;
    var compression = args.compression;

    console.log('Starting Web Server on port: ' + port);
    console.log('  Compression: ' + compression);

    var mount = st({
        path: __dirname + '/',
        url: '/',
        index: false,
        dot: false,
        passthrough: false,
        gzip: compression,
        cache: {

        }

    });

    var app = connect()
        .use(connect.responseTime)
        .use(mount);

    this.webServer_ = http.createServer(app).listen(port);
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
    return deferred.promise;
};


module.exports = exports = new WebServer();
