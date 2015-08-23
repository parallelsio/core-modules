'use strict';

define(['modules/config', 'modules/messenger', 'DDP'], function (config, messenger, DDP) {
  var ddp;

  function setExtensionEnabled(enabled) {
    if (enabled) {
      chrome.browserAction.setBadgeText({text: ''});
      chrome.browserAction.enable();
    } else {
      chrome.browserAction.setBadgeText({text: '!'});
      chrome.browserAction.disable();
    }
  }

  function websocketEndpoint(host) {
    return "ws://" + host + "/websocket";
  }

  function connect(server) {
    setExtensionEnabled(false);

    ddp = new DDP({
      endpoint: websocketEndpoint(server),
      SocketConstructor: WebSocket
    });

    ddp.on('connected', function () {
      setExtensionEnabled(true);
    });
  }

  config.getServer(connect);

  messenger.registerEvent('server-changed', function (event) {
    setExtensionEnabled(false);

    if (ddp) {
      ddp.socket.endpoint = websocketEndpoint(event.newValue);
      ddp.socket.rawSocket.close();
    } else {
      connect(event.newValue);
    }
  });

  return {
    /**
     * Save a bit to the parallels server
     * @param bit
     * @param cb
     */
    saveBit: function (bit, cb) {
      //console.log('saving to meteor');
      //console.log(bit);
      //bit.canvasId = '1';
      //var promise = ddp.call('changeState', {
      //  command: 'createBit',
      //  data: bit
      //});
      //promise.result.then(cb);
    },

    /**
     * Update a bit on the parallels server
     * @param id
     * @param bit
     */
    updateBit: function (bit) {
      //console.log('updating bit');
      //console.log(bit);
      //return ddp.call('changeState', {
      //  command: 'clipWebpage',
      //  data: bit
      //});
    },

    ddp: ddp
  };
});
