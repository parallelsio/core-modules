describe('making a parallel', function() {

  xit("should start when the 'shift' key is pressed, if hovered over a bit", function (done) {
  
      Meteor.setTimeout(function(){
        Session.set('bitHoveringId', 'xxxxxxxxx'); // is this right?
        Mousetrap.trigger('shift');
        expect(Session.get('currentMode')).toEqual('create-parallel');
        done();
      }, 600);
  });

  xit("should cancel when the 'esc' key is pressed", function (done) {
  
      Meteor.setTimeout(function(){
        Mousetrap.trigger('shift');
        Mousetrap.trigger('esc');
        expect(Session.get('currentMode')).toBeNull();
        done();
      }, 600);
  });

  // OQ: does this test too many things at once?
  xit("should exit with success if 'shift' key is pressed, on selecting a destination bit, once inside this mode", function (done) {
  
      Meteor.setTimeout(function(){
        Mousetrap.trigger('shift');
        Mousetrap.trigger('shift');
        expect(Session.get('currentMode')).toBeNull();
        done();
      }, 600);
  });


  it("should not start if the 'shift' key is pressed while mousing over a non-bit coordinate", function (done) {
  
      Meteor.setTimeout(function(){
        Session.set('bitHoveringId', null); // is this right?
        Mousetrap.trigger('shift');
        expect(Session.get('currentMode')).toBeNull(); // ? is this right?
        done();
      }, 600);
  });

});
