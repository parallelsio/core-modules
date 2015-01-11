'use strict';

// jshint ignore:start
var requirejsConfig = {
  baseUrl: '/scripts',
  paths: {
    'DDP': '../bower_components/ddp.js/src/ddp',
    'Q': '../bower_components/q/q',
    'Asteroid': '../bower_components/asteroid/dist/asteroid.chrome',
    'jquery': '../bower_components/jquery/dist/jquery',
    'jquery.caret': 'lib/vendor/jquery.caret.min',
    'jquery.tag-editor': 'lib/vendor/jquery.tag-editor',
    'mousetrap': '../bower_components/mousetrap/mousetrap',
    'TimelineLite': '../bower_components/gsap/src/minified/TweenMax.min',
    'Quint': '../bower_components/gsap/src/minified/TweenMax.min'
  },
  shim: {
    'jquery.caret': ['jquery'],
    'jquery.tag-editor': ['jquery', 'jquery.caret'],
    mousetrap: ['jquery']
  }
};
// jshint ignore:end
