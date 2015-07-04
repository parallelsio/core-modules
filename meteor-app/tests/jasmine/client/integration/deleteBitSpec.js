describe('a bit delete', function() {

  // base test
  xit("should happen when the 'd' key is pressed, if hovered over a bit", function (done) {
    Meteor.setTimeout(function(){
      Session.set('bitHoveringId', 'wer345'); // is this right?
      Mousetrap.trigger('d');

      // TODO: expect the bit with ID wer345 to not be on the canvas 
      // TODO: expects the MongoID not to exist
      // TODO: expects no records to exists anywhere in neo4j that match the Mongo primary Id

      // OQ: do all 3 conditions get combined, or better to split out to different tests?

      done();
    }, 600);
  });

  // OQ: should this get rolled into base test ?
  xit("should reset the bitHoveringId after a successful delete", function (done) {
    Meteor.setTimeout(function(){
      Session.set('bitHoveringId', 'xxxxxxxxx'); // is this right?
      Mousetrap.trigger('d');
      expect(Session.get('bitHoveringId')).toBeNull();
      done();
    }, 600);
  });

  xit("should do nothing, if activated while mousing over a non-bit coordinate", function (done) {
    Meteor.setTimeout(function(){
      Session.set('bitHoveringId', null); // is this right?
      Mousetrap.trigger('d');
      // How do we test this? theres no bit existence to check?
      // do we wire to the "else" part of the delete function, 
      // like the log output, but this feels flaky
      done();
    }, 600);
  });

});
