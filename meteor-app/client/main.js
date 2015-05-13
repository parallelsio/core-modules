Meteor.startup(function(){

  log.debug("Meteor.startup begin.");

  Tracker.autorun(function() {
    log.debug(Bits.find().count() + ' bits, via Tracker:autorun');
  });

  Tracker.autorun(function() {
    log.debug('Session:bitHoveringId is now: ', Session.get("bitHoveringId"), ', via Tracker:autorun');
  });


});