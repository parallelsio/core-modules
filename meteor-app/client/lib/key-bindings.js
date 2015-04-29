Meteor.startup(function() {

  Mousetrap.bind('space', function (event) {
    try {
      event.stopPropagation();
      event.preventDefault();
    } catch (err) { /* Try/Catch is here for integration tests: https://github.com/ccampbell/mousetrap/issues/257 */ }
    Parallels.AppModes['preview-bit'].enter();
  });

  Mousetrap.bind('shift', Parallels.AppModes['create-parallel'].enter);

  Mousetrap.bindGlobal('esc', function() {
    var currentMode = Session.get('currentMode');
    if (!currentMode) return;
    Parallels.AppModes[currentMode].exit();
  });

  Mousetrap.bind("d", function() {
    console.log("pressed d");
    var bitHoveringId = Session.get('bitHoveringId');
    if (bitHoveringId) {
      Meteor.call('removeBit', bitHoveringId);
      console.log("bit:delete: " + bitHoveringId);
    }
  });
});
