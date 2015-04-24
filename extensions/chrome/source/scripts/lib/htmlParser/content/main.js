'use strict';

requirejs(['modules/messenger', 'lib/htmlParser/content/content'], function (messenger, HTMLParser) {

  messenger.registerEvent('pageRequest', HTMLParser.initPage);

  HTMLParser.init();

});
