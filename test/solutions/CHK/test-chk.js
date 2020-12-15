var mocha = require('mocha')
var describe = mocha.describe
var it = mocha.it
var assert = require('assert');
const checkout = require('../../../lib/solutions/CHK/checkout');

describe('SUM challenge: adding two numbers', function() {
  it('return correct price 1', function() {
    assert.equal(checkout('A'), 50);
  });

  // it('return correct price 2', function() {
  //   assert.equal(checkout('AAAAAA'), 260);
  // });

  it('return correct price 3', function() {
    assert.equal(checkout('BBBB'), 90);
  });

  // it('return correct price 4', function() {
  //   assert.equal(checkout('ABCDCBAABCABBAAA'), 505);
  // });

  it('return correct price 5', function() {
    assert.equal(checkout('EEEEBB'), 160);
  });

  it('return correct price 6', function() {
    assert.equal(checkout('EEB'), 80);
  });

  it('return correct price 7', function() {
    assert.equal(checkout('FF'), 20);
  });

  it('return correct price 8', function() {
    assert.equal(checkout('FFFF'), 30);
  });

  it('return correct price 9', function() {
    assert.equal(checkout('FFFFFF'), 40);
  });
});

