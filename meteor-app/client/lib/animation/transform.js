/*
      TODO: pass one bit object, get the other things from it, 
      versus passing 3 diff parts of similar objects
      
      TODO: refactor: combine bit references, 
      and dont go to Session store for original H/W

      TODO: refactor, break up into mode/enter + mode/exit?
  */

Transform = {
  
  /* 
    DOCS: 
    /private/docs/bit-preview-animation-coordinates-v1.jpg

    The same image asset is being used on the canvas for both:
    -- the thumbnail, on the canvas, the before/contracted state
    -- the full viewport, the previewed/expanded state

    Example diagram of both states, and some arbitrary dimensions.
    Shows the order of solving, via the circled numbers 1, 2, 3, 4, 5. 

    Once the values are calculated, note which attributes are animated
    where:

        +------ Bit Container Element   ( animates X, Y positions)
        \ ----- Img Element             ( animates height, width)

    This is to give the appearance that the image is expanding/contracting
    in place, rather than loading a separate, view which would
    give a disjointed appearance.

    All numbers/dimensions/units are in pixels.
  */

  scaleImage: function(options){
    /*
        bitData: bitData,
        $bit: $bit,
        bitTemplate: bitTemplate,
        direction: "expand" | "contract"
    */

    var $bitImg = $(options.bitTemplate.templateInstance().$('img'));

    var bitThumbHeight  = $bitImg.height();
    var bitThumbWidth   = $bitImg.width();
    var bitThumbX       = options.$bit.position().left;
    var bitThumbY       = options.$bit.position().top;

    var maskLeft         = $('.wipe.bit-preview.side-to-side .mask.left');
    var maskRight        = $('.wipe.bit-preview.side-to-side .mask.right');

    var documentWidth  = $(document).width();

    /*
       Set up + calc the vars needed to animate

       When expanding, we use up the most of the viewport space 
       to preview, as is available, after leaving some margin from the edges.
       We save the bit's thumbnail image height+width, and original x,y position in a session var
       so we can easily animate back on the contract.
    */
    if (options.direction === "expand") {
      // padding for top and bottom
      // TODO: left + right, for very wide images
      var edgePadding = 10;

      /*
        using d.d.c faster than jQuery(window).width()
        http://ryanve.com/lab/dimensions
        TODO: refactor to use Verge lib. available as Meteor package?
        calc the height available, accounting for space for image to breathe from edges
      */
      var availableHeight = document.documentElement.clientHeight - (edgePadding * 2);

      // use availableHeight to determine previewWidth
      if ((options.bitData.nativeHeight > bitThumbHeight) &&
          (bitThumbHeight <= availableHeight)) {

        var previewHeight = availableHeight;

        /*
            Solve for the preview width:

             nativeHeight       previewHeight
            -------------  =  ----------------
             nativeWidth       x (previewWidth)
        */
        var previewWidth = Math.floor((options.bitData.nativeWidth * previewHeight) / options.bitData.nativeHeight);
      }

      var bitImgOptions = {
        ease: Power4.easeOut,
        width: previewWidth,
        height: previewHeight,
        scale: 1
      };

      var bitContainerOptions = {
        ease: Power4.easeOut,
        /* 
          since the bit container already has x,y transform applied
          to position it on the canvas, we'll need to 
          override them temporarily.

          Move the container (and thus the previewed image),
          to the center of the viewport
        */
        x: (verge.viewportW() / 2) - (previewWidth / 2),
        y: (verge.viewportH() / 2) - (previewHeight / 2)
      };
    }

    // Use the original thumbnail height + width as the destination. 
    // We saved these to a session var, before expanding
    else if (options.direction === "contract") {

      var bitImgOptions = {
        ease: Power4.easeOut,
        width: Session.get('bitThumbWidth'),
        height: Session.get('bitThumbHeight'),
        scale: 1
      };

      var bitContainerOptions = {
        ease: Power4.easeOut,
        x: Session.get('bitThumbX'),
        y: Session.get('bitThumbY')
      };
    }

    var timelineStart = function () {
      log.debug('bit:preview timeline starting ...');

      // TODO: disable bit actions (drag, delete)

      if (options.direction === "expand") {
        Session.set('bitThumbHeight', bitThumbHeight);
        Session.set('bitThumbWidth', bitThumbWidth);
        Session.set('bitThumbX', bitThumbX);
        Session.set('bitThumbY', bitThumbY);

        Parallels.Audio.player.play('fx-quad-ripple');
      }

      else if (options.direction === "contract"){
        Session.set('bitThumbWidth', null);
        Session.set('bitThumbHeight', null);
        Session.set('bitThumbX', null);
        Session.set('bitThumbY', null);

        Parallels.Audio.player.play('fx-temp-temp');
      }
    };

    var timelineDone = function( direction ){
      log.debug("bit:preview: " , direction, " : tween done." );
    };

    var timeline = new TimelineMax({
      onStart: timelineStart,
      onComplete: timelineDone,
      onCompleteParams:[ options.direction ]
    });

    /*  
        Run the animations
        Settings + sequencing inspired by the Zelda 'wipes'
        https://www.youtube.com/watch?v=wHaZrYX0kAU&t=14m54s
    */
    if (options.direction === "expand") {
      log.debug("expanding...");

      $("body").css( "overflow", "hidden"); // disabling scrolling
      log.debug("bitImgOptions: ", bitImgOptions);
      log.debug("bitContainerOptions: ", bitContainerOptions);

      timeline
        .set($('.wipe.bit-preview.side-to-side'), { alpha: 1, display: "block" })
        .fromTo(maskRight,  0.20, { x:  documentWidth / 2, ease: Expo.easeOut }, { x: 0 }, 0.15 )
        .fromTo(maskLeft,   0.20, { x: -documentWidth / 2, ease: Expo.easeOut }, { x: 0 }, 0.15 )

        .set(options.$bit, { zIndex: 10 })

        // blow up image from thumbnail size up to fit the viewport height
        // and move its container (and it) to position. Run simultaneously
        .to($bitImg, 0.20, bitImgOptions )
        .to(options.$bit, 0.20, bitContainerOptions, "-=0.20" );
    }

    else if (options.direction === "contract") {
      log.debug("contracting...");

      $("body").css( "overflow", "visible"); // re-enabling scrolling

      timeline
        .fromTo(maskLeft,   0.20, { x: 0 }, { x: -documentWidth / 2, ease: Expo.easeOut }, 0.15 )
        .fromTo(maskRight,  0.20, { x: 0 }, { x:  documentWidth / 2, ease: Expo.easeOut }, 0.15 )

        // contract image from viewport height down to original thumbnail size
        // run at the same time
        .to($bitImg, 0.20, bitImgOptions )
        .to(options.$bit, 0.20, bitContainerOptions, "-=0.20" )

        .set(options.$bit, { zIndex: 1 })
        .set($('.wipe.bit-preview.side-to-side'), { alpha: 0, display: "none" });
    }
  }
};
