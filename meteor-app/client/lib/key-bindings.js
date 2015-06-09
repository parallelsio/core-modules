/*

  TODO:
    * add a check before each bind function
      to ensure it doesnt already exist.

*/

Parallels.KeyCommands = {

  bindAll: function(){
    log.debug("keyCommand:bindAll");

    this.bindDeleteBit();
    this.bindCreateSketchBit();
    this.bindCreateTextBit();
    this.bindEditTextBit();
    this.bindBeginCreateParallel();
    this.bindImageBitPreview();
    this.bindHistory();
    this.bindUndo();
    this.bindRedo();
    this.bindShortcuts();
    this.bindEsc();
  },

  disableAll: function(){
    log.debug("keyCommand:disableAll");

    // delete bit
    Mousetrap.unbind('d');       
    
    // edit text bit
    Mousetrap.unbind('e');  

    // create new text bit
    Mousetrap.unbind('t');

    // preview
    Mousetrap.unbind('space');    
    
    // create-parallel
    Mousetrap.unbind('shift');                                    
    
    // cancel/close
    Mousetrap.unbind('esc');                                   
    
    // history dialog, for undo/redo
    Mousetrap.unbind('h');   

    // undo last action
    // handles both command + control for Win/Mac/Linux                                 
    Mousetrap.unbind('mod+z');

    // redo last action
    Mousetrap.unbind('mod+shift+z');

    // create new sketch bit
    Mousetrap.unbind('s');

    // shortcuts
    Mousetrap.unbind('tab');

  },

  bindShortcuts: function(){
    log.debug("keyCommand:bindShortcuts");

    Mousetrap.bind("tab", function() {
      log.debug("pressed 'tab' key");
  
      Blaze.render(Template.shortcutsModal, document.body);
    });
  },

  bindDeleteBit: function(){
    log.debug("keyCommand:bindDeleteBit");

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

  bindEditTextBit: function(){
    log.debug("keyCommand:bindEditTextBit");

    Mousetrap.bind("e", function() {
      log.debug("pressed 'e' key");
      var bitHoveringId = Session.get('bitHoveringId');

      if (bitHoveringId) {
        Parallels.AppModes['edit-bit'].enter(bitHoveringId);
      }

      else {
        log.debug ('edit key ignored, not captured for a specific bit')
      }

    });
  },

  bindImageBitPreview: function(){
    log.debug("keyCommand:bindImageBitPreview");

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
        log.debug("already previewing bit: ", bitPreviewingId);
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

  bindBeginCreateParallel: function(){
    log.debug("keyCommand:bindBeginCreateParallel");

    Mousetrap.bind('shift', function (){
      var bitHoveringId = Session.get('bitHoveringId');
      var currentMode = Session.get('currentMode');

      // begin craete parallel, 
      // bitHoveringId is the origin/source bit
      if (bitHoveringId && (!currentMode)) {
        Parallels.AppModes['create-parallel'].enter();
      }

      // else if (bitHoveringId && (currentMode === 'create-parallel')) {
      //   debug.log('closing parallel with ', bitHoveringId);
      // }
    });
  },

  bindCreateSketchBit: function(){
    log.debug("keyCommand:bindCreateSketchBit");

    Mousetrap.bind('s', function (event){
      Parallels.AppModes['sketch-bit'].enter(event);
    });
  },

  bindCreateTextBit: function(){
    log.debug("keyCommand:bindCreateTextBit");

    Mousetrap.bind('t', function (event) {
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

    Mousetrap.bind('mod+z', function () {
      Meteor.call('undoState', { canvasId: '1'});
    });
  },

  bindRedo: function () {
    log.debug("keyCommand:bindRedo");

    Mousetrap.bind('mod+shift+z', function () {
      Meteor.call('redoState', { canvasId: '1'});
    });
  }

};