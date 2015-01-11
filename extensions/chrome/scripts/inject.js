'use strict';

requirejs.config(requirejsConfig);

requirejs(['jquery', 'lib/modules/config', 'lib/modules/messenger', 'Quint', 'TimelineLite'],
  function ($, config, messenger, Quint, TimelineLite) {

    var _container = null;
    var ID = {
      CONTAINER		: 'parallels-container',
      IFRAME_PREFIX	: 'parallels-iframe'
    };

    var loadClipper = function () {
      _container = $('<div />', {id:ID.CONTAINER});
      _container.appendTo(document.body);

      var src		= chrome.extension.getURL('html/web_clipper.html?_'+(new Date().getTime()));
      var iframe	= $('<iframe />', {id: ID.IFRAME_PREFIX, src: src, scrolling: false});
      _container.append(iframe);
    };

    var showClipper = function () {
      var tl = new TimelineLite();
      tl.pause()
        .to(_container, 0.25, { top:'0', ease: Quint.easeOut })
        .call(function(){
          console.log('Parallels clipper: done animating dialog into DOM.');
        })
        .play();
    };

    var saveBit = function (deregister, data) {
      console.log('inject:saveBit');
      console.log(data);
      var message = {event: 'persist-bit', bit: data.bit};
      chrome.extension.sendMessage({ data	: message });
      closeClipper();
    };

    var closeClipper = function () {
      var tl = new TimelineLite();
      tl.pause()
        .to(_container, 0.325, { top:'-300px', ease: Quint.easeIn })
        .call(function(){
          console.log('Parallels clipper: done animating dialog out of DOM.');
        })
        .play();
    };

    var onIframeLoaded = function () {
      var data = {event: 'clipper-ready'};
      chrome.extension.sendMessage({ data	: data });
    };

    messenger.registerEvent('iframe-loaded', onIframeLoaded);
    messenger.registerEvent('show-clipper', showClipper);
    messenger.registerEvent('save-bit', saveBit);
    messenger.registerEvent('close-clipper', closeClipper);

    loadClipper();
  });
