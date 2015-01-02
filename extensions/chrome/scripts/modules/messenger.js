'use strict';

define('messenger', function () {
  //where the event callbacks are stored
  var registry = [];

  /**
   * Called when an event message is received
   * @param name
   * @param message
   */
  function eventReceived(name, message) {
    //get the event callback
    var callback = registry[name];
    if (!callback)
      return;

    //pass a function (handle) to stop the listener and the message
    callback(function () {
      delete registry[name];
    }, message);
  }

  window.addEventListener('message', function (evt) {
    //if (evt.origin !== config.appRootUrl)
    //  return;
    console.log('window message received');

    //if the message has an event, trigger eventReceived
    var message = evt.data;
    if (message.event)
      eventReceived(message.event, message);
  }, false);

  if (chrome) {
    chrome.extension.onMessage.addListener(function (request) {
      console.log('chrome extension message received');
      var message = request.data;

      //if the message has an event, trigger eventReceived
      if (message.event)
        eventReceived(message.event, message);
    });
  }


  //callbacks listed by their message id

  return {
    /**
     * Register a codebounty app event and check the mailbox
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

      window.parent.postMessage(data, '*');
    }
  };
});
