'use strict';

/**
 * Main content script. Acts as a controller for actions initiated on the DOM of the current page.
 * Responsibilities include:
 *  - wiring up messages to actions using the messenger layer
 *  - relaying messages between the clipper iframe in the DOM and the background scripts
 */
requirejs(['browser', 'content/main', 'modules/messenger' ],
  function (browser, content, messenger) {

    var saveBit = function (data) {
      console.log('inject:saveBit');
      console.log(data);
      var message = {event: 'save-bit', bit: data.bit};
      browser.sendMessageToBackground({data: message});
      content.closeClipper();
    };

    var onIframeLoaded = function () {
      var data = {event: 'clipper-ready'};
      browser.sendMessageToBackground({data: data});
    };

    messenger.registerEvent('iframe-loaded', onIframeLoaded);
    messenger.registerEvent('show-clipper', content.showClipper);
    messenger.registerEvent('submit-bit', saveBit);
    messenger.registerEvent('close-clipper', content.closeClipper);

    content.loadClipperIframe(document.body);
  });
