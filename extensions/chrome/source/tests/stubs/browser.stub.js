define(function() {
  'use strict';

  var Browser = (function() {

    function Browser() {

      var
        self = this,
        _localStorage = {},
        _userNotifications = [],
        _bgMsgs = [],
        _contentMsgs = [],
        _listener;

      self.onExtensionTriggered = function (callback) {
        // console.log('browser.helper:onExtensionTriggered');
        callback({
          url: 'testurl.com',
          title: 'Test Url',
          nativeWidth: '800',
          nativeHeight: '600'
        });
      };

      self.saveLocal = function (data, callback) {
        console.log('browser.helper:saveLocal');
        _localStorage = data;
        callback();
      };

      self.notify = function (notification, callback) {
        // console.log('browser.helper:notify');
        _userNotifications.push(notification);
        callback();
      };

      self.screenshot = function (callback) {
        // console.log('browser.helper:saveLocal');
        callback('imgDataUrl');
      };

      self.getURL = function (path) {
        //console.log('browser.helper:getURL');
        console.log(path);
        return 'http://localhost:9000/' + path
      };

      self.sendMessageToDom = function (message, tabId) {
        console.log('browser.helper:sendMessageToDom');
        console.log(message);
        _contentMsgs.push(message);
        if (_listener) _listener(message);
        var frames = window.parent.frames;
        for (var i = 0; i < frames.length; i++) {
          frames[i].postMessage(message.data, '*');
        }
      };

      self.sendMessageToBackground = function (message) {
        // console.log('browser.helper:sendMessageToBackground');
        _bgMsgs.push(message);
        if (_listener) _listener(message);
      };

      self.currentTab = function (callback) {
        // console.log('browser.helper:currentTab');
        callback({id: 1});
      };

      self.onBackgroundConnection = function(callback) {
        // console.log('browser.helper:onBackgroundConnection');
        callback({
          id: 123,
          senderId: 1,
          onMessage: function(fn) { /* console.log('browser.helper:onBackgroundConnection:onMessage') */ },
          removeListener: function(fn) { /* console.log('browser.helper:onBackgroundConnection:removeListener') */ },
          onDisconnect: function(fn) { /* console.log('browser.helper:onBackgroundConnection:onDisconnect') */ },
          postMessage: function(fn) { /* console.log('browser.helper:onBackgroundConnection:postMessage') */ }
        })
      };

      self.connectToBackground = function() {
        // console.log('browser.helper:connectToBackground');
      };

      self.initMessageListener = function(listener) {
        // console.log('browser.helper:initMessageListener');
        _listener = listener;
      };

      self.localStorage = function() {
        return _localStorage;
      };
      self.userNotifications = function() {
        return _userNotifications;
      };
      self.bgMsgs = function() {
        return _bgMsgs;
      };

      self.contentMsgs = function() {
        return _contentMsgs;
      };
    }

    return Browser;
  })();

  return new Browser();
});
