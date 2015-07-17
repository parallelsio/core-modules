Meteor.startup(function () {

  log.debug("Meteor.startup begin.");

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
    if (isAudioEnabled) {
      Session.set('isAudioEnabled', true);
    }

    else {
      Session.set('isAudioEnabled', false);
    }
  });

  Tracker.autorun(function () {
    log.debug(Bits.find().count() + ' bits, via Tracker:autorun');
  });

  Tracker.autorun(function () {
    log.debug('Session:bitHoveringId is now: ', Session.get("bitHoveringId"), ', via Tracker:autorun');
  });

  var center = Utilities.getViewportCenter();
  pointerPosition = {
    x: center.x,
    y: center.y
  };

  Session.set('bitEditingId', null);

  $.fn.focusWithoutScrolling = function(){
    var x = verge.scrollX(), y = verge.scrollY();
    this.focus();
    window.scrollTo(x, y);
    return this;
  };
});
