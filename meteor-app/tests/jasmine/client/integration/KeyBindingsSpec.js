describe('Key Bindings', function() {

  describe('"ESC"', function () {

    it('should call exit() on the currentMode and set currentMode to null', function (done) {
      var mockMode = { exit: function(){} };
      Parallels.AppModes["mock-mode"] = mockMode;
      var exitMockMode = spyOn(mockMode, 'exit');
      Session.set('currentMode', 'mock-mode');

      Meteor.setTimeout(function() {
        Mousetrap.trigger('esc');
        expect(exitMockMode).toHaveBeenCalled();
        done();
      }, 600);
    });

    it('should not error trying to call exit() if currentMode is not set', function (done) {
      Session.set('currentMode', null);

      Meteor.setTimeout(function() {
        expect(function () {
          Mousetrap.trigger('esc');
        }).not.toThrow(new TypeError("Cannot read property 'exit' of undefined"));
        done();
      }, 600);
    });
  });
});
