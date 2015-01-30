define(function() {
  'use strict';

  var Server = (function() {

    function Server() {

      var self = this,
        bits = [];

      self.saveBit = function (bit) {
        bits.push(bit);
      };

      self.updateBit = function (id, bit) {
        return {};
      };

    }

    return Server;
  })();

  return new Server();
});
