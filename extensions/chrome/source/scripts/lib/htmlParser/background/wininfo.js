'use strict';

define(['modules/messenger', 'browser'], function (messenger, browser) {
  var callback;

  function onInitResponse(message) {
    if (message.initResponse) {
      console.log('background:wininfo:init: message.init-response');
      callback(message.processableDocs);
    }
  }

  messenger.registerEvent('init-response', onInitResponse);

  return {
    init: function (tabId, cb) {
      callback = cb;
      console.log('background:wininfo:init: send init-request');
      browser.sendMessageToDom({
        data: {
          initRequest: true,
          event: 'init-request',
          winId: "0",
          index: 0
        }
      }, tabId);
    }
  }

});
