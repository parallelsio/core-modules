'use strict';

/* global Asteroid */

define(['config'], function (config) {
  var ddp = new Asteroid(config.appRootUrl);

  return {
    /**
     * Connect to the parallels server
     * @param {Function} onConnected
     */
    saveBit: function (e, data) {
      console.log('saving to meteor');
      console.log(data);
      var bits = ddp.getCollection('bits');
      bits.insert(data.bit);
    },
    ddp: ddp
  };
});
