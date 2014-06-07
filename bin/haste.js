#!/usr/bin/env node
'use strict';

process.title = "haste";

var packageJson = require(__dirname + '/../package.json');
var manager = require(__dirname + '/../lib/manager');
var os = require('os');

var commands = require('yargs')
    .usage('Load testing using simulated browsers\nUsage: $0 -u [URL]')
    .example('$0 --url http://www.site.com', 'Run a simple test with one agent against www.site.com')
    .example('$0 --url http://www.site.com/p1.html --url http://www.site.com/p1.html', 'Run a test against two pages of www.site.com')
    .example('$0 -a 2 --url http://www.site.com', 'Run a test with two agents against www.site.com')
    .option({
        url: {
            alias: 'u',
            describe: 'Add a url step to the flow',
            type: 'string'
        },
        agents: {
            alias: 'a',
            describe: 'Number of agents to run concurrently',
            default: os.cpus().length
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

['url'].forEach(function(prop) {
    if (argv[prop] && !Array.isArray(argv[prop])) {
        argv[prop] = [argv[prop]];
    }
});

if(argv.help === true) {
    commands.showHelp();
    process.exit(0);
}
if(argv.version === true) {
    console.log('haste version: %s', packageJson.version);
    process.exit(0);
}

if(!argv.url) {
    commands.showHelp();
    console.error('At least one url is required to start the test');
    process.exit(1);
}

//console.log(argv.url);


manager.launch(argv);
