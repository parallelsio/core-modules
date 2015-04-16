// use lodash instead of underscore
// https://github.com/meteor/meteor/issues/1009
_ = lodash;


Meteor.startup(function(){

  console.log("Meteor.startup begin.");
  
    // reset any leftover session vars from last load
  Session.set('bitPreviewingId', null);
  Session.set('bitThumbnailWidth', null);
  Session.set('bitThumbnailHeight', null);
  Session.set('bitHoveringId', null);
  Session.set('bitEditingId', null);
  Session.set('isDrawingParallel', false);

  console.log("Meteor.startup ended.");

  Tracker.autorun(function() {
    console.log(Bits.find().count() + ' bits... updated via deps');
  });
});