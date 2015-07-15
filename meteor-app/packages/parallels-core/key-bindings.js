/*

 TODO:
 * add a check before each bind function
 to ensure it doesnt already exist.

 * refactor structure into bind + unbind for each key

 */


// extract as a general function
function _toggleShortcutsPanel(direction) {

  var left = 0;
  var bindings;

  if (direction === "open") {
    left = 0;
    bindings = _bindShortcutEvents;
    Session.set('isShortcutsDisplayed', true);
  }

  else if (direction === "close") {
    left = "-15ems";
    bindings = function unBindHovers() {
      console.log("TODO: unbind shortcut hovers");
    };
    Session.set('isShortcutsDisplayed', false);
  }

  var timeline = new TimelineMax();
  timeline
    .to(
    $(".shortcuts")[0],   // what to tween
    0.2,                  // speed
    {
      left: left,
      ease: Power4.easeIn
    })
    .add(bindings())
    .play();
}

function _bindShortcutEvents() {

  $('.shortcut').each(function () {
    var $shortcut = $(this);

    var $cursor = $shortcut.find('.shortcut__cursor');
    var $minibit = $shortcut.find('.shortcut__bit');
    var $key = $shortcut.find('.shortcut__key');
    var $flyout = $shortcut.find('.shortcut__flyout');

    var timeline = new TimelineMax({
      paused: true
    });

    if ($key.hasClass('shortcut__key--sequence')) {
      timeline
        .to($cursor, 1, {left: "1.5em", top: "1.5em", ease: Power4.easeIn, y: 0, opacity: 1})
        .to($minibit, 0, {borderTop: "0.3em solid #8B8BF5"}, "-=0.2")
        // TODO: play sound that matches the shortcut key
        .to($key, 0, {left: "3px", top: "3px"}, "+=0.3")
        .to($key, 0, {left: 0, top: 0}, "+=0.75")
    }

    $shortcut.on("mouseenter",
      {
        hoverTimeline: timeline,
        $flyout: $flyout[0]
      },

      function (event) {
        event.data.$flyout.style.display = "block";
        event.data.hoverTimeline.restart();
      }
    );

    $shortcut.on("mouseleave",
      {
        hoverTimeline: timeline,
        $flyout: $flyout[0],
        $minibit: $minibit[0],
        $cursor: $cursor[0]
      },

      function (event) {

        // hide panel and reset hover animations for this shortcut key
        event.data.$flyout.style.display = "none";
        event.data.$minibit.style.border = 0;
        event.data.$cursor.style.left = "3em";
        event.data.$cursor.style.top = "3em";
        event.data.$cursor.style.opacity = 0;
        event.data.hoverTimeline.pause();
      }
    );
  });
}


Parallels.Keys = {

  bindAll: function () {

    // TODO: add 'except' param, convery this list into a map
    console.log("keyCommand:bindAll");

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
    // this.bindEsc();
  },

  disableAll: function () {
    console.log("keyCommand:disableAll");

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
    // Mousetrap.unbind('esc');

    // history dialog, for undo/redo
    Mousetrap.unbind('h');

    // undo last action
    // mod is an alias for both Apple/command (Mac) and control (Win/Linux)
    Mousetrap.unbind('mod+z');

    // redo last action
    Mousetrap.unbind('mod+shift+z');

    // create new sketch bit
    Mousetrap.unbind('s');

    // shortcuts
    Mousetrap.unbind('1', function () {

      _toggleShortcutsPanel("close");

      // TODO: clear + garbage collect timeline objects, handlers
      $('.shortcut').each(function () {
        $shortcut = $(this);
        console.log('unbinding each shortcut: ', $shortcut);
      });

    });

  },

  bindShortcuts: function () {
    console.log("keyCommand:bindShortcuts");
    Session.set('isShortcutsDisplayed', false);

    Mousetrap.bind("1", function () {
      console.log("pressed '1' key");

      if (Session.equals('isShortcutsDisplayed', false)) {
        _toggleShortcutsPanel("open");
        _bindShortcutEvents();
      }

      else if (Session.equals('isShortcutsDisplayed', true)) {
        _toggleShortcutsPanel("close");
      }

    });
  },

  bindDeleteBit: function () {
    console.log("keyCommand:bindDeleteBit");

    Mousetrap.bind("d", function () {
      console.log("pressed 'd' key");
      var bitHoveringId = Session.get('bitHoveringId');

      if (bitHoveringId) {
        console.log("starting bit:delete on ", bitHoveringId);
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
        console.log('delete key ignored, not captured for a specific bit')
      }

    });
  },

  bindEditTextBit: function () {
    console.log("keyCommand:bindEditTextBit");

    Mousetrap.bind("e", function () {
      console.log("pressed 'e' key");
      var bitHoveringId = Session.get('bitHoveringId');

      if (bitHoveringId) {
        Parallels.AppModes['edit-bit'].enter(bitHoveringId);
      }

      else {
        console.log('edit key ignored, not captured for a specific bit')
      }

    });
  },

  bindImageBitPreview: function () {
    console.log("keyCommand:bindImageBitPreview");

    Mousetrap.bind('space', function (event) {
      console.log("pressed 'Space' key");
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
        console.log("already previewing bit: ", bitPreviewingId);
        return false; // failcheck - end if we're somehow already previewing
      }

      if (bitHoveringId) {
        Parallels.AppModes['preview-bit'].enter();
      }

      else {
        console.log('space key ignored, not captured for a specific bit')
      }
    });
  },

  bindBeginCreateParallel: function () {
    console.log("keyCommand:bindBeginCreateParallel");

    Mousetrap.bind('shift', function () {
      var bitHoveringId = Session.get('bitHoveringId');
      var currentMode = Session.get('currentMode');

      // begin craete parallel,
      // bitHoveringId is the origin/source bit
      if (bitHoveringId && (!currentMode)) {
        Parallels.AppModes['create-parallel'].enter();
      }

      // else if (bitHoveringId && (currentMode === 'create-parallel')) {
      //   console.log('closing parallel with ', bitHoveringId);
      // }
    });
  },

  bindCreateSketchBit: function () {
    console.log("keyCommand:bindCreateSketchBit");

    Mousetrap.bind('s', function () {
      Meteor.call('changeState', {
        command: 'createBit',
        data: {
          canvasId: '1',
          type: 'sketch',
          content: [],
          color: 'color',
          position: {
            x: 50,
            y: 80
          }
        }
      });
    });
  },

  bindCreateTextBit: function () {
    console.log("keyCommand:bindCreateTextBit");

    Mousetrap.bind('t', function (event) {
      Parallels.AppModes['create-bit'].enter(event);
    });
  },

  bindEsc: function () {
    console.log("keyCommand:bindEsc");

    Mousetrap.bindGlobal('esc', function () {
      console.log("pressed 'Esc' key");
      var currentMode = Session.get('currentMode');

      if (!currentMode) return;
      Parallels.AppModes[currentMode].exit();
    });
  },

  bindHistory: function () {
    console.log("keyCommand:bindHistory");

    Mousetrap.bind('h', function () {
      var viewingEventLog = Session.get('viewingEventLog');
      Session.set('viewingEventLog', !viewingEventLog);
    });
  },

  bindUndo: function () {
    console.log("keyCommand:bindUndo");

    Mousetrap.bind('mod+z', function () {
      Meteor.call('undoState', {canvasId: '1'});
    });
  },

  bindRedo: function () {
    console.log("keyCommand:bindRedo");

    Mousetrap.bind('mod+shift+z', function () {
      Meteor.call('redoState', {canvasId: '1'});
    });
  }

};
