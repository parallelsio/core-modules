var
  $bit,
  bit,
  bitTemplate,
  bitPreviewingId,
  bitHoveringId;

Parallels.AppModes['preview-bit'] = {

  enter: function () {
    Parallels.log.debug("mode:preview-bit:enter");

    bitHoveringId = Session.get('bitHoveringId');
    $bit = Utilities.getBitElement(bitHoveringId);
    bitTemplate = Utilities.getBitTemplate(bitHoveringId);
    bit = Blaze.getData(bitTemplate);

    // only supporting image preview currently
    // webpage is currently represented on canvas as an image
    if ((bit.type === "image") || (bit.type === "webpage")){
      bitPreviewingId = bitHoveringId;
      Session.set('currentMode', 'preview-bit');
      Session.set('bitPreviewingId', bitPreviewingId);

      Parallels.log.debug("bit:image:preview: " + bitPreviewingId);
      Parallels.Keys.unbindActions();

      var options = {
        bit: bit,
        $bit: $bit,
        bitTemplate: bitTemplate,
        direction: "expand",
        displayScale: true,
        paused: true
      };

      var sample = classifyColors($bit); 

      var tl = Parallels.Animation.Image.morph(options);

      tl
        .to( 
          $bit.find('.scale__container'), 
          0.25, 
          { 
            width: 400,
            height: "100%",
            opacity: 1, 
            autoAlpha: 1, 
            ease: Circ.easeIn 
          },
          "-=0.1"
        )
        
        .staggerTo(
          $bit.find('.scale__container .swatch'),
          0.1,
          {
            opacity: 1,
            autoAlpha: 1,
            ease: Circ.easeIn 
          },
          0.05,
          "-=0.25"
        )
      
      tl.play();

      Draggable.get( $bit ).disable();
      // $bit.removeClass('hovering');
      // Session.set('bitHoveringId', null);
      
      // TODO: disable bitHover too

    }

    else {
      Parallels.log.debug("bit:preview: is not an image. Do nothing." );
    }
  },

  exit: function () {
    Parallels.log.debug("mode:preview-bit:exit");

    // refactor: get rid of dep on these vars.
    var bitPreviewingId = Session.get('bitPreviewingId');
    $bit = Utilities.getBitElement(bitPreviewingId);
    var bitTemplate = Utilities.getBitTemplate(bitPreviewingId);
    var bit = Blaze.getData(bitTemplate);

    if (bitPreviewingId) {
      // TODO: pass the assignment/resetting of these
      // into Animation.scale,
      // which will then reset it once the animation complete callback is triggered
      // this will avoid potential edge cases where person takes
      // action in between animations
      Session.set('currentMode', null);
      Session.set('bitPreviewingId', null);

      Parallels.Keys.bindActions();

      var options = {
        bit: bit,
        $bit: $bit,
        bitTemplate: bitTemplate,
        direction: "contract",
        paused: true
      };

      var tl = Parallels.Animation.Image.morph(options);

      tl
        .to( 
          $bit.find('.scale__container'), 
          0.1, 
          { 
            opacity: 0, 
            height: 0, 
            width: 0, 
            autoAlpha: 0, 
            ease: Power4.easeOut 
          }, 
          "-=0.4"
        )

        .set ($bit.find('.scale__container .swatch'), { opacity: 0, autoAlpha: 0 }  )
      
      tl.play();

      Draggable.get( $bit ).enable();
    }

    else {
      Parallels.log.debug("nothing to close: not previewing a bit");
    }
  }
};
