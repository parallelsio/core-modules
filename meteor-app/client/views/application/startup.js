// use lodash instead of underscore
// https://github.com/meteor/meteor/issues/1009
_ = lodash;


Meteor.startup(function(){

  console.log("Meteor.startup begin.");
  
  Tracker.autorun(function() {
    console.log(Bits.find().count() + ' bits... updated via deps');
  });

  console.log("Meteor.startup ended.");

});

