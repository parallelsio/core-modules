'use strict';

define(['modules/config', '../../bower_components/ddp.js/src/ddp', 'Q', 'Asteroid'], function (config, DDP, Q, Asteroid) {
  window.DDP = DDP;
  window.Q = Q;
  var ddp = new Asteroid(config.appRootUrl);
  var bits = ddp.getCollection('bits');

  return {
    /**
     * Save a bit to the parallels server
     * @param bit
     */
    saveBit: function (bit) {
      console.log('saving to meteor');
      console.log(bit);
      bits.insert(bit);
    },

    /**
     * Update a bit on the parallels server
     * @param id
     * @param bit
     */
    updateBit: function (id, bit) {
      console.log('updating bit');
      console.log(bit);
      return bits.update(id, bit);
    },

    findByPageIdentifier: function (pageIdentifier) {
      return bits.reactiveQuery({ pageIdentifier: pageIdentifier }).result;
    },

    ddp: ddp
  };
});
