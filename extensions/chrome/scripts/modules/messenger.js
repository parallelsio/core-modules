'use strict';

define(function () {
  var registry = [];

  /**
   * Called when an event message is received
   * @param name
   * @param message
   */
  function eventReceived(name, message) {
    var callback = registry[name];
    if (!callback)
      return;

    callback(message, function () {
      delete registry[name];
    });
  }

  window.addEventListener('message', function (evt) {
    //TODO: What should we be doing here to remain secure?
    //if (evt.origin !== config.appRootUrl)
    //  return;
    //console.log('window message received');

    var message = evt.data;
    if (message.event)
      eventReceived(message.event, message);
  }, false);

  //TODO: should move to browser specific module and encapsulate sending extension message
  // i.e. browser.initListeners(function (request) {} );
  if (chrome) {
    chrome.extension.onMessage.addListener(function (request) {
      //console.log('chrome extension message received');
      var message = request.data;

      if (message && message.event)
        eventReceived(message.event, message);
    });
  }

  return {
    /**
     * Register an app event and check the mailbox
     * for that event to see if there are already any messages
     * @param name the event to register ex. 'close'
     * @param {Function} callback (message)
     */
    registerEvent: function (name, callback) {
      registry[name] = callback;
    },

    /**
     * Called to send an event message
     * @param name
     * @param message
     */
    sendEvent: function (name, message) {
      var data = message || {};
      data.event = name;
      //TODO: Is there a better way to send messages over the DOM? What should the source URL be?
      window.parent.postMessage(data, '*');
    }
  };
});
