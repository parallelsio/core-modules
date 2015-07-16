Meteor.startup(function () {

  console.log("Meteor.startup begin.");

  Parallels.Keys.bindAll();
  Parallels.Keys.bindEsc();

  // TODO: extract out into Utility? or Config?
  // get settings
  Meteor.call('getSetting', 'isAudioEnabled', function (err, isAudioEnabled) {
    if (isAudioEnabled) {
      Session.set('isAudioEnabled', true);
    }

    else {
      Session.set('isAudioEnabled', false);
    }
  });

  Tracker.autorun(function () {
    console.log(Bits.find().count() + ' bits, via Tracker:autorun');
  });

  Tracker.autorun(function () {
    console.log('Session:bitHoveringId is now: ', Session.get("bitHoveringId"), ', via Tracker:autorun');
  });

  var center = Utilities.getViewportCenter();
  pointerPosition = {
    x: center.x,
    y: center.y
  };

  Session.set('bitEditingId', null);
});
