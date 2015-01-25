'use strict';

requirejs(['modules/messenger', 'htmlParser/content'], function(messenger, HTMLParser) {

  messenger.registerEvent('pageRequest', HTMLParser.initPage);

  HTMLParser.init();

});
