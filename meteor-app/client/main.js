Meteor.startup(function(){

  console.log("Meteor.startup begin.");

  Parallels.Keys.bindAll();

  Meteor.call('getSetting', 'isAudioEnabled', function (err, isAudioEnabled) {
    if (isAudioEnabled){
      Parallels.Audio.player.play("fx-welcome-v1.wav");
    }
  });

  Tracker.autorun(function() {
    console.log(Bits.find().count() + ' bits, via Tracker:autorun');
  });

  Tracker.autorun(function() {
    console.log('Session:bitHoveringId is now: ', Session.get("bitHoveringId"), ', via Tracker:autorun');
  });

  Session.set('createTextBit', null);
});
