// Parallels Chrome Extension Web Clipper
// 2014, Angel Balcarcel, https://github.com/parallelsio/chrome-clipper

'use strict';

/**
 * Clipper Iframe Controller. Acts as a controller for actions sent to the clipper iframe.
 * Responsibilities include:
 *  Wiring up messages to actions using the messenger layer
 */
requirejs(['modules/messenger', 'content/clipper/ui'],
  function (messenger, ui) {

    messenger.registerEvent('clipper-activated', ui.onClipperActivated);

    ui.initialize();
  });
