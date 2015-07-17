// refactor out into parallels-panels package
Parallels.Panels = {

  toggleShortcuts: function() {

    function _bindShortcutEvents() {

      $('.shortcut').each(function () {
        var $shortcut = $(this);

        var $cursor = $shortcut.find('.shortcut__cursor');
        var $minibit = $shortcut.find('.shortcut__bit');
        var $key = $shortcut.find('.shortcut__key');
        var $flyout = $shortcut.find('.shortcut__flyout');
        var isSequenceKeyCommand = $key.hasClass('shortcut__key--sequence') ? true : false;

        var timeline = new TimelineMax({
          paused: true
        });

        if (isSequenceKeyCommand) {
          timeline
            .to($cursor, 0.3, {left: "2em", top: "1.5em", ease: Power2.easeIn, y: 0, opacity: 1})
            .to($minibit, 0, {borderTop: "0.3em solid #8B8BF5"}, "-=0.075")
            .call(Parallels.Audio.player.play, ['fx-ting3'], "-=0.3")
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
            isSequenceKeyCommand: isSequenceKeyCommand,
            $flyout: $flyout[0],
            $minibit: $minibit[0],
            $cursor: $cursor[0],
            $key: $key[0]
          },

          function (event) {

            event.data.$flyout.style.display = "none";

            if (event.data.isSequenceKeyCommand) {
              event.data.$minibit.style.border = 0;
              event.data.$cursor.style.left = "3em";
              event.data.$cursor.style.top = "3em";
              event.data.$cursor.style.opacity = 0;
              event.data.$key.style.left = 0;
              event.data.$key.style.top = 0;

              event.data.hoverTimeline.pause();
              event.data.hoverTimeline.seek(0);
            }
          }
        );
      });
    }

    function _unbindShortcutEvents() {

      // TODO: GC all the instances of timeline for each shortcut
      // that were bound
      $('.shortcut').each(function () {
        var $shortcut = $(this);
        $shortcut.off("mouseenter");
        $shortcut.off("mouseleave");
      });

      return "";
    }
    
    var left;
    var bindings;
    var easeType;

    if (Session.equals('isShortcutsDisplayed', true)){
      // prepare to close
      console.log("_toggleShortcutsPanel: close");

      left = "-15em";
      bindings = _unbindShortcutEvents;
      Session.set('isShortcutsDisplayed', false);
      easeType = Expo.easeOut;

    }

    else {
      // prepare to open
      left = 0;
      bindings = _bindShortcutEvents;
      Session.set('isShortcutsDisplayed', true);
      easeType = Expo.easeIn;
    }


    var timeline = new TimelineMax();
    timeline
      .to(
      $(".shortcuts")[0],   // what to tween
      0.1,                  // speed
      {
        left: left,
        ease: easeType
      })
      .add(bindings)
      .play();
  }
  
}

