'use strict';

requirejs.config({
  baseUrl: '/scripts',
  paths: {
    'DDP': '../bower_components/ddp.js/dist/ddp',
    'wolfy87-eventemitter': '../bower_components/EventEmitter.js/EventEmitter',
    'jquery': '../bower_components/jquery/dist/jquery',
    'jquery.caret': 'lib/jquery.caret.min',
    'jquery.tag-editor': 'lib/jquery.tag-editor',
    'mousetrap': '../bower_components/mousetrap/mousetrap',
    'TimelineLite': '../bower_components/gsap/src/minified/TweenMax.min',
    'Quint': '../bower_components/gsap/src/minified/TweenMax.min',
    'browser': 'modules/chrome'
  },
  shim: {
    'jquery.caret': ['jquery'],
    'jquery.tag-editor': ['jquery', 'jquery.caret'],
    'mousetrap': ['jquery']
  }
});
