'use strict';

define(['modules/config', '../../bower_components/ddp.js/src/ddp', '../../bower_components/q/q', 'Asteroid'], function (config, DDP, Q, Asteroid) {
  window.DDP = DDP;
  window.Q = Q;
  var ddp = new Asteroid(config.appRootUrl);
  var bits = ddp.getCollection('bits');

  return {
    /**
     * Save a bit to the parallels server
     * @param bit
     * @param cb
     */
    saveBit: function (bit, cb) {
      console.log('saving to meteor');
      console.log(bit);
      bit.canvasId = '1';
      var promise = ddp.call('changeState', {
        command: 'createBit',
        data: bit
      });
      promise.result.then(cb);
    },

    /**
     * Update a bit on the parallels server
     * @param id
     * @param bit
     */
    updateBit: function (bit) {
      console.log('updating bit');
      console.log(bit);
      return ddp.call('changeState', {
        command: 'clipWebpage',
        data: bit
      });
    },

    findByPageIdentifier: function (pageIdentifier) {
      return bits.reactiveQuery({ pageIdentifier: pageIdentifier }).result;
    },

    ddp: ddp
  };
});
