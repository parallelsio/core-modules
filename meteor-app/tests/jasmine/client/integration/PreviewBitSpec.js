describe('Preview Bit Mode', function() {

  xit('should start when the space bar key is pressed', function (done) {
    Meteor.setTimeout(function(){
      Mousetrap.trigger('space');
      expect(Session.get('currentMode')).toEqual('preview-bit');
      done();
    }, 600);
  });

  xit('should exit when the "Esc" key is pressed', function (done) {
    Meteor.setTimeout(function(){
      Mousetrap.trigger('space');
      Mousetrap.trigger('esc');
      expect(Session.get('currentMode')).toBeNull();
      done();
    }, 600);
  });
});
