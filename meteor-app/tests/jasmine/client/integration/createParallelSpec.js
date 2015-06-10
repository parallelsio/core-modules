describe('Create Parallel Mode', function() {

  it('should start when the shift key is pressed, while hovering over a bit', function (done) {
    Meteor.setTimeout(function(){
      Session.set(('bitHoveringId'), 'xxxxxxxxx'); // is this right?
      Mousetrap.trigger('shift');
      expect(Session.get('currentMode')).toEqual('create-parallel');
      done();
    }, 600);
  });

  it('should exit when the "Esc" key is pressed', function (done) {
    Meteor.setTimeout(function(){
      Mousetrap.trigger('shift');
      Mousetrap.trigger('esc');
      expect(Session.get('currentMode')).toBeNull();
      done();
    }, 600);
  });

  it('should not start, if the shift key is pressed while mousing over a non-bit location', function (done) {
    Meteor.setTimeout(function(){
      Session.set(('bitHoveringId'), null); // is this right?
      Mousetrap.trigger('shift');
      expect(Session.get('currentMode')).toBeNull(); // ? is this right?
      done();
    }, 600);
  });

});
