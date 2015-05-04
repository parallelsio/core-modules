Meteor.startup(function(){

  Parallels.Sound.player.init();

  console.log("Meteor.startup begin.");
  
  Tracker.autorun(function() {
    console.log(Bits.find().count() + ' bits... updated via deps');
  });

});

