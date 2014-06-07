'use strict';

var chai = require('chai');
var expect = chai.expect;

describe('initial fake test', function() {
    it('should always pass, its a string', function() {
        expect('hello').to.be.a('string');
    });
    it('should always pass, foo is length 3', function() {
        expect('foo').to.have.length(3);
    });
});
