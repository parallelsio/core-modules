'use strict';

/**
 * Main content script. Acts as a controller for actions initiated on the DOM of the current page.
 * Responsibilities include:
 *  - wiring up messages to actions using the messenger layer
 *  - relaying messages between the clipper iframe in the DOM and the background scripts
 */
requirejs(['browser', 'lib/app', 'lib/modules/messenger'],
  function (browser, app, messenger) {

    var saveBit = function (data) {
      console.log('inject:saveBit');
      console.log(data);
      var message = {event: 'save-bit', bit: data.bit};
      browser.sendMessageToBackground({data: message});
      app.closeClipper();
    };

    var onIframeLoaded = function () {
      var data = {event: 'clipper-ready'};
      browser.sendMessageToBackground({data: data});
    };

    messenger.registerEvent('iframe-loaded', onIframeLoaded);
    messenger.registerEvent('show-clipper', app.showClipper);
    messenger.registerEvent('submit-bit', saveBit);
    messenger.registerEvent('close-clipper', app.closeClipper);

    app.loadClipperIframe(document.body);
  });
