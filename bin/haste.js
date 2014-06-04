#!/usr/bin/env node
'use strict';

var packageJson = require(__dirname + '/../package.json');
var parseArgs = require('minimist');

var paramOptions = {
    boolean: [
        'version',
        'help'
    ],
    string: [
        'url'
    ],
    alias: {
        'v': 'version',
        'h': 'help',
        'u': 'url'
    },
    default: {
        version: false,
        help: false
    }
};

var argv = parseArgs(process.argv.slice(2), paramOptions);

if(argv.help === true) {
    showUsageHelp();
}

if(argv.version === true) {
    console.log('haste version: %s', packageJson.version);
    process.exit(0);
}

if(!argv.url) {
    showUsageHelp();
}

console.log("running...");
//console.dir(argv);

function showUsageHelp()
{
    console.log('Usage: haste [options]');
    console.log('   --help           Show this help');
    console.log('   --version        Show version number');
    console.log('   --url            Add a URL step to the test');
    process.exit(1);
}