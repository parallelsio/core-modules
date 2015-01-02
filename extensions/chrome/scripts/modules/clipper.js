'use strict';

/* jshint jquery: true */

requirejs(['messenger'],
  function(messenger) {
    function initialize () {
      console.log('parallels:init');
      $('button.cancel').on('click', onCancel);
      messenger.sendEvent('iframe-loaded', {});
    }

    function onCancel (){
      console.log('parallels:onCancel');
      messenger.sendEvent('close-clipper', {});
    }

    function onClipperActivated (data) {
      console.log('parallels:onClipperActivated');
      $('.bit-title').val(data.title);
      $('.bit-screenshot').attr('src', data.imgDataUrl);
      messenger.sendEvent('show-clipper', {});
    }

    messenger.registerEvent('clipper-activated', onClipperActivated);

    initialize();
  }
);
