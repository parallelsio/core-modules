Meteor.startup(function(){

  console.log("Meteor.startup begin.");

  // we enable the core *actions, ie
  // bit operations: Examples: bit:create, bit:delete, etc.
  // These get bound and unbound based on where person is,
  // what context they are 
  Parallels.Keys.bindActions();

  // the core system navigation shortcuts,
  // that should persist regardless of context
  Parallels.Keys.bindEsc();
  Parallels.Keys.bindShortcuts();

  // TODO: extract out into Utility? or Config?
  // get settings
  Meteor.call('getSetting', 'isAudioEnabled', function (err, isAudioEnabled) {
    if (isAudioEnabled){
      Session.set('isAudioEnabled', true);
    }

    else{
      Session.set('isAudioEnabled', false);
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
