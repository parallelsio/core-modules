'use strict';


/**
 * Used by both the background scripts and the inject script
 * Responsibilities include:
 *  - Showing/Hiding Clipper frame
 *  - Interacting with the server layer
 */
define(['browser', 'jquery', 'lib/modules/config', 'lib/modules/server', 'Quint', 'TimelineLite', 'htmlParser'],
  function (browser, $, config, server, Quint, TimelineLite, HTMLParser) {

    // TODO: How should we add new bits locally and at the same time have the list refresh while in development?
    var localBits = {},
      clipperContainer = null,
      ID = {CONTAINER: 'parallels-container', IFRAME_PREFIX: 'parallels-iframe'};

    /**
     * Load the clipper iframe into the given container
     * @param container
     */
    var loadClipperIframe = function (container) {
      clipperContainer = $('<div />', {id: ID.CONTAINER});
      clipperContainer.appendTo(container);

      var src = browser.getURL('html/web_clipper.html?_' + (new Date().getTime()));
      var iframe = $('<iframe />', {id: ID.IFRAME_PREFIX, src: src, scrolling: false});
      clipperContainer.append(iframe);
    };

    HTMLParser.subscribe('process-start', function(message) {
      //chrome.tabs.sendMessage(pageData.tabId, message);
      console.log('received process-start');
      console.log(message);
    });

    HTMLParser.subscribe('process-progress', function(message) {
      //chrome.tabs.sendMessage(pageData.tabId, message);
      console.log('received process-progress');
      console.log(message);
    });

    HTMLParser.subscribe('process-end', function(message) {
      console.log('finished parsing HTML');
      var pageIdentifier = btoa(message.data.url);
      localBits[pageIdentifier].html = message.data.content;
      localBits[pageIdentifier].liftStatus = 'complete';
      var updatedBit = JSON.parse(JSON.stringify(localBits[pageIdentifier]));
      delete updatedBit._id;
      var response = server.updateBit(localBits[pageIdentifier]._id, updatedBit);
      response.remote.then(function(data) {
        browser.notify({title: 'Bit Lift Complete', message: 'Page processed'}, function () {
          console.log('update is complete');
          console.log(data);
          delete localBits[pageIdentifier];
        });
      });
      response.remote.fail(function(err) {
        console.log('update is complete');
        console.log(err);
      });
    });

    /**
     * Bit: lift off!
     * @param pageInfo
     * @param callback
     */
    var startClipping = function (pageInfo) {
      var pageIdentifier = btoa(pageInfo.url);
      var bit = {
        type: 'webpage',
        liftStatus: 'processing',
        url: pageInfo.url,
        title: pageInfo.title,
        nativeWidth: pageInfo.nativeWidth,
        nativeHeight: pageInfo.nativeHeight,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      localBits[pageIdentifier] = bit;

      browser.saveLocal({'parallels:bits': localBits}, function () {

        //TODO: easy way to toggle these types of comments in development
        //chrome.storage.local.get('parallels:bits', function(storage) {
        //  console.log(storage['parallels:bits']);
        //});

        browser.currentTab(function (tabId) {
          HTMLParser.start({id: tabId, config: null, tabIds: null, processSelection: false, processFrame: false});
        });

        browser.notify({title: 'Bit Lift Received', message: 'Page saved'}, function () {

          browser.screenshot(function (dataUrl) {
            localBits[pageIdentifier].imgDataUrl = dataUrl;
            saveBit({bit: localBits[pageIdentifier]});
            var message = JSON.parse(JSON.stringify(localBits[pageIdentifier]));
            message.event = 'clipper-activated';
            browser.sendMessageToDom({data: message});
          });
        });
      });
    };

    /**
     * Animate the clipper iframe into view
     */
    var showClipper = function () {
      var tl = new TimelineLite();
      tl.pause()
        .to(clipperContainer, 0.25, {top: '0', ease: Quint.easeOut})
        .call(function () {
          console.log('Parallels clipper: done animating dialog into DOM.');
        })
        .play();
    };

    /**
     * Animate the clipper out of view
     */
    var closeClipper = function () {
      var tl = new TimelineLite();
      tl.pause()
        .to(clipperContainer, 0.325, {top: '-300px', ease: Quint.easeIn})
        .call(function () {
          console.log('Parallels clipper: done animating dialog out of DOM.');
        })
        .play();
    };

    /**
     * Save the bit back to the server
     * @param data
     */
    var saveBit = function (data) {
      server.saveBit(data.bit);
    };

    return {
      loadClipperIframe: loadClipperIframe,
      startClipping: startClipping,
      showClipper: showClipper,
      closeClipper: closeClipper,
      saveBit: saveBit
    };

  });
