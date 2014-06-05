'use strict';

var spawn = require("child_process").spawn;
var fs = require('fs');

var workerClientScript = fs.workingDirectory + '/lib/worker-client.js';
var worker = spawn('node', [workerClientScript]);

worker.stdout.on("data", function (data) {
    console.log("Data::", JSON.stringify(data));
});

worker.on("exit", function (code) {
    console.log("Exit worker-client:", code);
});

setTimeout(function () {
    worker.kill("SIGKILL");
    phantom.exit(0);
}, 2000);


