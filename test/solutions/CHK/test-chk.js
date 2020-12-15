var mocha = require('mocha')
var describe = mocha.describe
var it = mocha.it
var assert = require('assert');
const checkout = require('../../../lib/solutions/CHK/checkout');

describe('SUM challenge: adding two numbers', function() {
  it('return correct price', function() {
    assert.equal(checkout(['A']), 50);
  });
});
