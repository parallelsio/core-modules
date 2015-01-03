// Parallels Chrome Extension Web Clipper
// 2014, Angel Balcarcel, https://github.com/parallelsio/chrome-clipper

'use strict';

requirejs.config(requirejsConfig);

requirejs(['config', 'server', 'messenger'],
  function (config, server, messenger) {

    var onClipperReady = function () {
      console.log('background:onClipperReady');
      chrome.browserAction.onClicked.addListener(onClipperActivated);
    };


    var onClipperActivated = function (tab) {
      chrome.tabs.captureVisibleTab(null, {}, function (dataUrl) {
        chrome.tabs.sendMessage(tab.id, {
          data: {
            event: 'clipper-activated',
            url: tab.url,
            title: tab.title,
            imgDataUrl: dataUrl,
            nativeWidth: tab.width,
            nativeHeight: tab.height
          }
        });
      });
    };

    messenger.registerEvent('clipper-ready', onClipperReady);
    messenger.registerEvent('persist-bit', server.saveBit);
  });
