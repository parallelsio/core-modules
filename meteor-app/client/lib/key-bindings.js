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
    this.bindCreateParallel();
    this.bindImagePreview();
    this.bindEsc();
    this.bindHistory();
    this.bindUndo();
    this.bindRedo();
    this.bindCreateSketchBit();
    this.bindCreateTextBit();
  },

  disableAll: function(){
    log.debug("keyCommand:disableAll");

    // delete bit
    Mousetrap.unbind('d');       
    
    // preview
    Mousetrap.unbind('space');    
    
    // create-parallel
    Mousetrap.unbind('shift');                                    
    
    // cancel/close
    Mousetrap.unbind('esc');                                   
    
    // history dialog, for undo/redo
    Mousetrap.unbind('h');   

    // undo last action                                 
    Mousetrap.unbind(['command+z', 'ctrl+z']);

    // redo last action
    Mousetrap.unbind(['command+shift+z', 'ctrl+shift+z']);

    // create new sketch bit
    Mousetrap.unbind(['s']);

    // create new text bit
    Mousetrap.unbind(['t']);
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

      else {
        log.debug ('delete key ignored, not captured for a specific bit')
      }

    });
  },

  bindImagePreview: function(){
    log.debug("keyCommand:bindImagePreview");

    Mousetrap.bind('space', function (event) {
      log.debug("pressed 'Space' key");
      var bitHoveringId = Session.get('bitHoveringId');
      var bitPreviewingId = Session.get('bitPreviewingId');

      try {
        event.stopPropagation();
        event.preventDefault();
      }
      catch (err) {
        /*  Try/Catch is here for integration tests:
            https://github.com/ccampbell/mousetrap/issues/257
        */
      }

      if (bitPreviewingId) {
        log.debug("already preview bit: ", bitPreviewingId);
        return false; // failcheck - end if we're somehow already previewing
      }

      if (bitHoveringId) {
        Parallels.AppModes['preview-bit'].enter();
      }

      else{
        log.debug ('space key ignored, not captured for a specific bit')
      }
    });
  },

  bindCreateParallel: function(){
    // TODO: would be nice to log context of where this binding came from
    log.debug("keyCommand:bindCreateParallel");

    Mousetrap.bind('shift', function (){
      Parallels.AppModes['create-parallel'].enter();
    });
  },

  bindCreateSketchBit: function(){
    log.debug("keyCommand:bindCreateSketchBit");

    Mousetrap.bind('s', function (){
      Parallels.AppModes['sketch-bit'].enter(event);
    });
  },

  bindCreateTextBit: function(){
    log.debug("keyCommand:bindCreateTextBit");

    Mousetrap.bind('t', function() {
      Parallels.AppModes['create-bit'].enter(event);
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

  bindHistory: function () {
    log.debug("keyCommand:bindHistory");

    Mousetrap.bind('h', function () {
      var viewingEventLog = Session.get('viewingEventLog');
      Session.set('viewingEventLog', !viewingEventLog);
    });
  },

  bindUndo: function () {
    log.debug("keyCommand:bindUndo");

    Mousetrap.bind(['command+z', 'ctrl+z'], function () {
      Meteor.call('undoState', { canvasId: '1'});
    });
  },

  bindRedo: function () {
    log.debug("keyCommand:bindRedo");

    Mousetrap.bind(['command+shift+z', 'ctrl+shift+z'], function () {
      Meteor.call('redoState', { canvasId: '1'});
    });
  }

};