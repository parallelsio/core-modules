define(function() {
  var callback;

  function onInitResponse(message) {
    if (message.initResponse) {
      console.log('background:wininfo:init: message.initResponse');
      callback(message.processableDocs);
    }
  }

  chrome.extension.onMessage.addListener(onInitResponse);

  return {
    init : function(tabId, cb) {
      callback = cb;
      console.log('background:wininfo:init: send initRequest');
      chrome.tabs.sendMessage(tabId, {
        initRequest : true,
        winId : "0",
        index : 0
      });
    }
  }

});
