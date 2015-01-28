define(['Squire'], function(Squire) {

  var injector = new Squire(), localStorage, scriptMsgs, userMsgs;

  injector.mock('modules/server', {
    saveBit: function() {}
  });

  injector.mock('browser', {
    saveLocal: function(data, fn) { localStorage = data; fn(); },
    currentTab: function(fn) { fn(); },
    notify: function(msg, fn) { userMsgs.push(msg); fn(); },
    screenshot: function(fn) { fn('imgDataUrl'); },
    sendMessageToDom: function(msg) { scriptMsgs.push(msg); }
  });
  //
  //injector.mock('htmlParser/background', {
  //  start: function() {},
  //  subscribe: function() {}
  //});

  var Background;

  beforeEach(injector.run(['background/main'], function(background) {
    Background = background;
    localStorage = null;
    scriptMsgs = [];
    userMsgs = [];
  }));

  describe('Background', function() {

    describe('startClipping:', function() {

      beforeEach(function() {
        Background.startClipping({
          url: 'testurl.com',
          title: 'Test Url',
          nativeWidth: '600',
          nativeHeight: '800'
        });
      });

      it('should not create multiple extension listeners when initializing page parsing multiple times.', function () {
        Background.startClipping({
          url: 'testurl.com',
          title: 'Test Url',
          nativeWidth: '600',
          nativeHeight: '800'
        });
      });

      it('should save the bit to local storage', function() {
        expect(localStorage['parallels:bits'][btoa('testurl.com')]).not.toBeNull();
        expect(localStorage['parallels:bits'][btoa('testurl.com')].title).toEqual('Test Url');
      });

      it('should immediately notify the user the save request was received');

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
