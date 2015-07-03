describe('a text bit edit', function() {

  xit("should begin when the 'e' key is pressed, if hovered over a bit", function (done) {
    Meteor.setTimeout(function(){
      Session.set('bitHoveringId', 'abc123'); // is this right?
      Mousetrap.trigger('e');

      // TODO: expect a form to show inside the the DOM element of ID abc123 
      done();
    }, 600);
  });

  xit("should save content, once edit form is displayed and 'enter' key is pressed", function (done) {
    Meteor.setTimeout(function(){
      Session.set('bitHoveringId', 'trf567'); // is this right?
      // set mode
      // show form
      Mousetrap.trigger('enter'); // is this the right way? cross browser, return ?

      // expects the content has been saved to Mongo with id trf567
      // expect form no longer exists?
      done();
    }, 600);
  });

  // OQ: should this get rolled into base test ?
  xit("should reset the bitEditingId after a successful save", function (done) {
    Meteor.setTimeout(function(){
      Session.set('bitHoveringId', 'xxxxxxxxx'); // is this right?
      Mousetrap.trigger('e');
      // set content
      // trigger enter key
      // save content to db
      expect(Session.get('bitEditingId')).toBeNull();
      done();
    }, 600);
  });

  xit("should do nothing, if activated while mousing over a non-bit coordinate", function (done) {
    Meteor.setTimeout(function(){
      Session.set('bitHoveringId', null); // is this right?
      Mousetrap.trigger('e');
      // How do we test this? theres no bit existence to check?
      // do we wire to the "else" part of the delete function, 
      // like the log output, but this feels flaky
      done();
    }, 600);
  });

});
