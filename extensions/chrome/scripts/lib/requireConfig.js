'use strict';

requirejs.config({
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
    'Quint': '../bower_components/gsap/src/minified/TweenMax.min',
    'browser': 'lib/modules/chrome',
    'htmlParser': 'lib/htmlParser/background/main'
  },
  shim: {
    'jquery.caret': ['jquery'],
    'jquery.tag-editor': ['jquery', 'jquery.caret'],
    'mousetrap': ['jquery'],
    'lib/htmlParser/background/observer': ['lib/htmlParser/background/index'],
    'lib/htmlParser/background/wininfo': ['lib/htmlParser/background/index'],
    'lib/htmlParser/background/nio': ['lib/htmlParser/background/index'],
    'lib/htmlParser/common/util': ['lib/htmlParser/background/index'],
    'lib/htmlParser/common/docprocessor': ['lib/htmlParser/background/index'],
    'lib/htmlParser/background/bgcore': ['lib/htmlParser/background/index'],
    'htmlParser': {
      deps: [
        'lib/htmlParser/background/index',
        'lib/htmlParser/background/observer',
        'lib/htmlParser/background/wininfo',
        'lib/htmlParser/background/nio',
        'lib/htmlParser/common/util',
        'lib/htmlParser/common/docprocessor',
        'lib/htmlParser/background/bgcore'
      ],
      init: function () {
        return {
          start: this.parallels.htmlParser.start,
          subscribe: this.parallels.observer.subscribe
        };
      }
    }
  }
});
