'use strict';

/* global MeteorDdp */

define(['config'], function (config) {
  var ddp = new MeteorDdp(config.webSocketUri);

  return {
    /**
     * Connect to the parallels server
     * @param {Function} onConnected
     */
    connect: function () {
      console.log('attempting connection to meteor');
    },
    ddp: ddp
  };
});
