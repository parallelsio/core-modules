describe('create bit action', function() {

  xit("should happen when the 't' key is pressed", function (done) {
    Meteor.setTimeout(function(){
      Session.set('bitEditingBitId', 'abc123'); 
      Mousetrap.trigger('t');

      // TODO: expect a form to show inside the the DOM element of ID abc123 
      done();
    }, 600);
  });

});