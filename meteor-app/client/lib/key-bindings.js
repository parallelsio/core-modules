/*

  OQ:
    * would binding 2x cause 2 listeners?
    * how to pass contextMessage properly

  TODO:
    * add a check before each bind function
      to ensure it doesnt already exist.

*/

Parallels.KeyCommands = {

  bindAll: function(){
    log.debug("keyCommand:bindAll");

    this.bindDelete();
    this.bindShift();
    this.bindSpace();
    this.bindEsc();
    this.bindLog();
    this.bindUndo();
    this.bindRedo();
  },

  disableAll: function(){
    log.debug("keyCommand:disableAll");

    Mousetrap.unbind('d');
    Mousetrap.unbind('space');
    Mousetrap.unbind('shift');
    Mousetrap.unbind('esc');
    Mousetrap.unbind('l');
    Mousetrap.unbind(['command+z', 'ctrl+z']);
    Mousetrap.unbind(['command+shift+z', 'ctrl+shift+z']);
  },


  bindDelete: function(){
    log.debug("keyCommand:bindDelete");

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
  },

  bindSpace: function(){
    log.debug("keyCommand:bindSpace");

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
  },

  bindShift: function(){
    //todo: would be nice to log context of where this binding came from
    log.debug("keyCommand:bindShift");

    Mousetrap.bind('shift', function (){
      Parallels.AppModes['create-parallel'].enter();
    });
  },

  bindEsc: function(){
    log.debug("keyCommand:bindEsc");

    Mousetrap.bindGlobal('esc', function() {
      log.debug("pressed 'Esc' key");
      var currentMode = Session.get('currentMode');

      if (!currentMode) return;
      Parallels.AppModes[currentMode].exit();
    });
  },

  bindLog: function () {
    Mousetrap.bind('l', function () {
      var viewingEventLog = Session.get('viewingEventLog');
      Session.set('viewingEventLog', !viewingEventLog);
    });
  },

  bindUndo: function () {
    Mousetrap.bind(['command+z', 'ctrl+z'], function () {
      Meteor.call('undoState', {canvasId: '1'});
    });
  },

  bindRedo: function () {
    Mousetrap.bind(['command+shift+z', 'ctrl+shift+z'], function () {
      Meteor.call('redoState', {canvasId: '1'});
    });
  }

};

