'use strict';


var net = require('net');

var client = net.connect({path: '/tmp/hasteManager.sock'});
