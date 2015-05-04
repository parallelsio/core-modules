Meteor.startup(function(){

  log.debug("Meteor.startup begin.");

  Tracker.autorun(function() {
    log.debug(Bits.find().count() + ' bits... updated via deps');
  });

});

