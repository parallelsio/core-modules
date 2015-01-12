// Parallels Chrome Extension Web Clipper
// 2014, Angel Balcarcel, https://github.com/parallelsio/chrome-clipper

'use strict';

/**
 * Main background script. Acts as a controller for actions initiated from the backend.
 * Responsibilities include:
 *  - wiring up messages to actions using the messenger layer
 */

//TODO: separate all chrome specific calls to a dependency
requirejs(['browser', 'lib/app', 'lib/modules/messenger'],
  function (browser, app, messenger) {

    var onClipperReady = function () {
      console.log('background:onClipperReady');
    };
    browser.onExtensionTriggered(app.startClipping);

    messenger.registerEvent('clipper-ready', onClipperReady);
    messenger.registerEvent('save-bit', app.saveBit);
  });
