'use strict';

define(['browser'], function (browser) {
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

  //TODO: should move to browser specific module and encapsulate extension env check
  if (window.chrome && window.chrome.extension) {
    browser.initMessageListener(function (message) {
      var data = message.data;

      if (data && data.event)
        eventReceived(data.event, data);
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
