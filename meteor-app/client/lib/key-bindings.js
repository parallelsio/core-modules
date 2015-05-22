Meteor.startup(function() {

  Mousetrap.bind('space', function (event) {
    log.debug("pressed 'Space' key");

    try {
      event.stopPropagation();
      event.preventDefault();
    }
    catch (err) {
      /*  Try/Catch is here for integration tests:
          https://github.com/ccampbell/mousetrap/issues/257
      */
    }

    Parallels.AppModes['preview-bit'].enter();
  });

  Mousetrap.bind('s', function (event) {
    log.debug("pressed 's' key");
    Parallels.AppModes['sketch-bit'].enter(event);
  });

  Mousetrap.bind('shift', function (){
    log.debug("pressed 'Shift' key");
    Parallels.AppModes['create-parallel'].enter();
  });

  Mousetrap.bindGlobal('esc', function() {
    log.debug("pressed 'Esc' key");
    var currentMode = Session.get('currentMode');

    if (!currentMode) return;
    Parallels.AppModes[currentMode].exit();
  });

  Mousetrap.bind("d", function() {
    log.debug("pressed 'd' key");
    var bitHoveringId = Session.get('bitHoveringId');

    if (bitHoveringId) {
      log.debug("starting bit:delete on ", bitHoveringId);
      Parallels.Audio.player.play('fx-tri');
      Meteor.call('changeState', {
        command: 'deleteBit',
        data: {
          canvasId: '1',
          _id: bitHoveringId
        }
      });
    }
  });
});
