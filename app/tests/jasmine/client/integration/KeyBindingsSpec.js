describe('Key Bindings', function() {

  describe('"ESC" key press', function () {

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

    it('should *not give an error, trying to call exit(), if currentMode isnt set', function (done) {
      Session.set('currentMode', null);

      Meteor.setTimeout(function() {
        expect(function () {
          Mousetrap.trigger('esc');
        }).not.toThrow(new TypeError("Cannot read property 'exit' of undefined"));
        done();
      }, 600);
    });

  });


  describe('"H" key press', function () {

    xit("should display activity stream", function (done) {
          Meteor.setTimeout(function(){
            Mousetrap.trigger('h');

            // TODO: expect activity stream container div to be in DOM 
            done();
          }, 600);
    });
  });
   
});
