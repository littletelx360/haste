#!/usr/bin/env node
'use strict';

process.title = "haste-ws";

var packageJson = require(__dirname + '/../package.json');
var webServer = require(__dirname + '/../lib/webserver');

var commands = require('yargs')
    .usage('Simple web server for haste\nUsage: $0')
    .example('$0', 'Launch the haste webserver')
    .example('$0 -p 80', 'Launch the haste webserver on port 8080')
    .option({
        port: {
            alias: 'p',
            describe: 'Listening port for webserver',
            default: 8080
        },
        compression: {
            alias: 'c',
            describe: 'Use compression',
            default: true
        },
        version: {
            alias: 'v',
            describe: 'Show the version number'
        },
        help: {
            alias: 'h',
            describe: 'Show the command line options'
        }
    });


var argv = commands.argv;

if(argv.help === true) {
    commands.showHelp();
    process.exit(0);
}
if(argv.version === true) {
    console.log('haste version: %s', packageJson.version);
    process.exit(0);
}




webServer.launch(argv);



