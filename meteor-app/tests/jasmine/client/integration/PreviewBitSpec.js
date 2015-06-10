describe('a bit preview', function() {

  xit("should begin when the 'spacebar' key is pressed, if hovered over a bit", function (done) {
    Meteor.setTimeout(function(){
      Session.set('bitHoveringId', 'xxxxxxxxx'); // is this right?
      Mousetrap.trigger('space');
      expect(Session.get('currentMode')).toEqual('preview-bit');
      done();
    }, 600);
  });

  xit("should exit, when the 'esc' key is pressed", function (done) {
    Meteor.setTimeout(function(){
      Mousetrap.trigger('space');
      Mousetrap.trigger('esc');
      expect(Session.get('currentMode')).toBeNull();
      done();
    }, 600);
  });

  it("should *not be entered, if the 'spacebar' key is pressed while mousing over a non-bit coordinate", function (done) {
    Meteor.setTimeout(function(){
      Session.set('bitHoveringId', null); // is this right?
      Mousetrap.trigger('shift');
      expect(Session.get('currentMode')).toBeNull(); // ? is this right?
      done();
    }, 600);
  });

});
