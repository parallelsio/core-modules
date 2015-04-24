define(['Squire', 'browser'], function (Squire, browser) {

  var injector = new Squire();

  injector.mock('modules/server', {
    saveBit: function () {
    }
  });

  injector.mock('browser', browser);

  var Background;

  beforeEach(injector.run(['background/main'], function (background) {
    Background = background;
  }));

  describe('Background', function () {

    describe('startClipping:', function () {

      beforeEach(function () {
        Background.startClipping({
          url: 'testurl.com',
          title: 'Test Url',
          nativeWidth: '600',
          nativeHeight: '800'
        });
      });

      it('should save the bit to local storage', function () {
        expect(browser.localStorage()['parallels:bits'][btoa('testurl.com')]).not.toBeNull();
        expect(browser.localStorage()['parallels:bits'][btoa('testurl.com')].title).toEqual('Test Url');
      });

      it('should immediately notify the user the save request was received');

      it('should immediately save initial data back to the server');

      describe('when HTML parsing is successful', function () {

        it('should remove the bit from local storage?');

        it('should update the server with the parsed HTML');
      });

    });

  });
});
