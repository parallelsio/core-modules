/*

  todo: on delete, if a bit is overlapping another, new hoveringId isnt updated

  should hover be a mode? implications?

*/

describe('a bit', function() {

  xit("hovered over, should set the session variable", function (done) {
    Meteor.setTimeout(function(){
      
      // how is this done? via mouse coordinates checking?
      done();
    }, 600);
  });

  xit("hovered out, should clear the session variable", function (done) {
    Meteor.setTimeout(function(){
      done();
    }, 600);
  });
 

});
