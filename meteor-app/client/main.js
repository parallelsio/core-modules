Meteor.startup(function(){

  log.debug("Meteor.startup begin.");

  Parallels.Keys.bindAll();
  Parallels.Audio.player.initAndStartEnv();

  // TODO: make Session bootup/init?
  Session.set('createTextBit', null);

  Tracker.autorun(function() {
    log.debug(Bits.find().count() + ' bits, via Tracker:autorun');
  });

  Tracker.autorun(function() {
    log.debug('Session:bitHoveringId is now: ', Session.get("bitHoveringId"), ', via Tracker:autorun');
  });

  // OQ: why is this reset twice? it's set above: line 9?
  Session.set('createTextBit', null);
});
