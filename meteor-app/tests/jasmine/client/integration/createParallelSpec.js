describe('Create Parallel Mode', function() {

  it('should start when the shift key is pressed', function (done) {
    Meteor.setTimeout(function(){
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
});
