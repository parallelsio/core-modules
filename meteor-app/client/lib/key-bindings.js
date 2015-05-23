Parallels.KeyCommands = {

  bindDelete: function(command){
    log.debug("keyCommand:bind", command);

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
  }
};






Meteor.startup(function() {

  // **********************************************
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

  // **********************************************
  Mousetrap.bind('shift', function (){
    log.debug("pressed 'Shift' key");
    Parallels.AppModes['create-parallel'].enter();
  });

  // **********************************************
  Mousetrap.bind('l', function () {
    var viewingEventLog = Session.get('viewingEventLog');
    Session.set('viewingEventLog', !viewingEventLog);
  });

  // **********************************************
  Mousetrap.bind(['command+z', 'ctrl+z'], function () {
    Meteor.call('undoState', {canvasId: '1'});
  });

  Mousetrap.bind(['command+shift+z', 'ctrl+shift+z'], function () {
    Meteor.call('redoState', {canvasId: '1'});
  });

  // **********************************************
  Mousetrap.bindGlobal('esc', function() {
    log.debug("pressed 'Esc' key");
    var currentMode = Session.get('currentMode');

    if (!currentMode) return;
    Parallels.AppModes[currentMode].exit();
  });

  // **********************************************

  Parallels.KeyCommands.bindDelete();

});
