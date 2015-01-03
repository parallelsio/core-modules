'use strict';

/* jshint jquery: true */

requirejs(['messenger'],
  function(messenger) {

    var bit;

    function initialize () {
      console.log('parallels:init');
      $('button.cancel').on('click', onCancel);
      $('button.submit').on('click', onSubmit);
      $('.bit-tags').tagEditor({
        delimiter: ',;', // comma, semicolon
        placeholder: 'Enter tags ...'
      });
      messenger.sendEvent('iframe-loaded', {});
    }

    function onCancel (){
      console.log('parallels:onCancel');
      messenger.sendEvent('close-clipper', {});
    }

    function onSubmit (){
      console.log('parallels:onSubmit');

      bit.title = $('.bit-title').val();
      bit.context = $('.bit-context').val();
      bit.tags = $('.bit-tags').tagEditor('getTags')[0].tags;

      messenger.sendEvent('save-bit', {bit: bit});
    }

    function onClipperActivated (deregister, data) {
      console.log('parallels:onClipperActivated');
      console.log(data);

      bit = {
        type: 'image',
        url: data.url,
        title: data.title,
        imageDataUrl: data.imgDataUrl,
        nativeWidth: data.nativeWidth,
        nativeHeight: data.nativeHeight,
        tags: [],
        context: null,
        createdAt: new Date()
      };

      $('.bit-title').val(data.title);
      $('.bit-screenshot').attr('src', data.imgDataUrl);
      messenger.sendEvent('show-clipper', {});
    }

    messenger.registerEvent('clipper-activated', onClipperActivated);

    initialize();
  }
);
