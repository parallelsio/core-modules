define(['Squire'], function(Squire) {

  var injector = new Squire(), localStorage, scriptMsgs, userMsgs;

  injector.mock('lib/modules/server', {
    saveBit: function() {}
  });

  injector.mock('browser', {
    saveLocal: function(data, fn) { localStorage = data; fn(); },
    currentTab: function(fn) { fn(); },
    notify: function(msg, fn) { userMsgs.push(msg); fn(); },
    screenshot: function(fn) { fn('imgDataUrl'); },
    sendMessageToDom: function(msg) { scriptMsgs.push(msg); }
  });

  injector.mock('htmlParser', {
    start: function() {},
    subscribe: function() {}
  });

  var App;

  beforeEach(injector.run(['lib/app'], function(app) {
    App = app;
    localStorage = null;
    scriptMsgs = [];
    userMsgs = [];
  }));

  describe('App Spec', function() {

    describe('startClipping:', function() {

      beforeEach(function() {
        App.startClipping({
          url: 'testurl.com',
          title: 'Test Url',
          nativeWidth: '600',
          nativeHeight: '800'
        });
      });

      it('should save the bit to local storage', function() {
        expect(localStorage['parallels:bits'].length).toEqual(1);
      });

      it('should immediately notify the user the save request was received', function() {
        expect(userMsgs.length).toEqual(1);
      });

      it('should immediately save initial data back to the server');

      describe('when HTML parsing is successful', function() {

        it('should remove the bit from local storage?');

        it('should update the server with the parsed HTML');
      });

    });

    describe('loadClipperIframe:', function() {

      it('should load the clipper HTML into the DOM');

    });

  });
});
