var
  assert = require('chai').assert,
  path = require('path'),
  loadFile = require('js-file-loader');

describe('stringToBoolean', function () {

  beforeEach(function () {
    context = loadFile(path.resolve(__dirname, '../../lib/utils.js'), {Parallels: {}});
    this.stringToBoolean = context.Parallels.utils.stringToBoolean;
  });

  it('should transform truthy string values to true', function () {
    assert.equal(this.stringToBoolean('true'), true);
    assert.equal(this.stringToBoolean('yes'), true);
    assert.equal(this.stringToBoolean('on'), true);
  });

  it('should transform falsy string values to false', function () {
    assert.equal(this.stringToBoolean('false'), false);
    assert.equal(this.stringToBoolean('no'), false);
    assert.equal(this.stringToBoolean('off'), false);
  });

  it('should return false if the string is not a truthy value', function () {
    assert.equal(this.stringToBoolean('foo'), false);
    assert.equal(this.stringToBoolean('bar'), false);
    assert.equal(this.stringToBoolean('anything here'), false);
    assert.equal(this.stringToBoolean('120'), false);
  });

  it('should NOT transform boolean values', function () {
    assert.equal(this.stringToBoolean(true), true);
    assert.equal(this.stringToBoolean(false), false);
  });

  it('should parse 1 or "1" as true', function () {
    assert.equal(this.stringToBoolean(1), true);
    assert.equal(this.stringToBoolean('1'), true);
  });

  it('should parse 0 or "0" as false', function () {
    assert.equal(this.stringToBoolean(0), false);
    assert.equal(this.stringToBoolean('0'), false);
  });
});
