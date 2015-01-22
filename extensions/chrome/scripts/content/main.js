'use strict';

define(['browser', 'jquery', 'Quint', 'TimelineLite'],
  function (browser, $, Quint, TimelineLite) {

    // TODO: How should we add new bits locally and at the same time have the list refresh while in development?
    var clipperContainer = null,
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

    return {
      loadClipperIframe: loadClipperIframe,
      showClipper: showClipper,
      closeClipper: closeClipper
    };

  });
