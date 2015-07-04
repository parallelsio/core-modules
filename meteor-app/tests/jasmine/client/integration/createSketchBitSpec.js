/*
  todo: create a sketch bit scrolled to x/y and ensure stroke is made at mouse coords,
        and offset is accoutned for

  todo: create sketch bit, up key changes opacity up, until it cant go no more, hits the limit
  todo: create sketch bit, up key changes opacity down, until it cant go no more, hits the limit

  as of now, no differentiation between creating + editing a sketch bit.
  once these are split out, will test independantly:
    todo: show: is it accessing the stored Ploma array data from Mongo and displaying it ?
    todo: edit: is it allowing and saving a change

*/
describe('a sketch bit', function() {

  xit("create, should happen when the 's' key is pressed", function (done) {
     
      Meteor.setTimeout(function(){
        Mousetrap.trigger('s');
        // expect a canvas element inside the sketch bit to exist
        done();
      }, 600);
  });

  xit("create, followed by a draw stroke, should save the draw strokes array to the bit's content in Mongo db", function (done) {
      
      Meteor.setTimeout(function(){
        Mousetrap.trigger('s');
        // draw a stroke A with ploma.setStrokes()
        // get from mongo, expect it to equal the ploma.getstrokes()
        done();
      }, 600);
  });

      // draw a stroke, ensure ploma values exist? this will probably fail because NPAPI plugin is needed
      // whereever this runs
  xit("create, followed by bit:preview, should return to sketch-mode", function (done) {
     
      Meteor.setTimeout(function(){
        Mousetrap.trigger('s');
        //  trigger bit preview mode
        // expect session current mode to be sketch mode
        done();
      }, 600);
  });

  // OQ:  to ensure another action cant be taken before the animation for bringing in
  //      the sketch bit, completes. Is this testable? 
  xit("create, rapidly followed by bit:text:create via the 't' key, should not trigger create-text-bit mode", function (done) {
      
      Meteor.setTimeout(function(){
        Mousetrap.trigger('s');
        done();
      }, 600);
  });

  // OQ: are we mixing testing ploma + testing our app in one, which is no good?
  // OQ: while ploma's randomizations, which will cause diff array values, make this fail?
  xit("create, followed by a draw stroke A, followed by a draw stroke B, followed by an undo action, should make sure stroke A exists alone", function (done) {
  
      Meteor.setTimeout(function(){
        Mousetrap.trigger('s');
        // draw a stroke A with ploma.setStrokes()
        // draw a stroke B with ploma.setStrokes()
        Mousetrap.trigger('mod+z');
        // test that only stroke A exists with Ploma.getStrokes()
        done();
      }, 600);
  });


  xit("create, followed by a draw stroke A, followed by a draw stroke B, followed by an clear sketch bit action, should make sure stroke A exists alone", function (done) {
  
      Meteor.setTimeout(function(){
        Mousetrap.trigger('s');
        // draw a stroke A with ploma.setStrokes()
        // draw a stroke B with ploma.setStrokes()
        Mousetrap.trigger('c');
        // test that only stroke A exists with Ploma.getStrokes()
        done();
      }, 600);
  });

});
