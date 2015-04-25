Meteor.startup(function(){

  console.log("Meteor.startup begin.");
  
  Tracker.autorun(function() {
    console.log(Bits.find().count() + ' bits... updated via deps');
  });

});

