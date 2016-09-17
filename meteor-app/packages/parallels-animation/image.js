
Parallels.Animation.Image = {

  morph: function(options){

  /*
    PURPOSE:
      Morph an image in place, rather than loading a separate file,
      which would display a disjointed, jarring experience

      The same image asset is being used on the canvas for both:
      -- the thumbnail on the canvas, the before/contracted state
      -- the full viewport, in the previewed/expanded state
    -----------------------------------------------------------

    DOCS:
      /private/docs/bit-preview-animation-coordinates-v1.jpg

      Example diagram of both states, and some arbitrary dimensions.
      Shows the order of solving, via the circled numbers 1, 2, 3, 4, 5.

      Once the values are calculated, note which attributes are animated
      where:

          +------ Bit Container Element   ( animates X, Y positions)
            \ ------ Img Element          ( animates height, width)


      All numbers/dimensions/units are in pixels
    -----------------------------------------------------------

    OPTIONS/PARAMS:

      bit: bit,                     // the db model
      $bit: $bit,                   // jquery object
      bitTemplate: bitTemplate,
      direction: "expand" | "contract"
    -----------------------------------------------------------

    TODO:
      * pass one bit object, get the other things from it,
        versus passing 3 diff parts of similar objects

      * dont go to Session store for original height/width

      * make generic: remove references to bit

      * break up into mode/enter + mode/exit?

      * shift wave down to lay over bit 1:1

    -----------------------------------------------------------
  */

    var $bitImg = $(options.bitTemplate.templateInstance().$('img'));

    var bitThumbHeight  = $bitImg.height();
    var bitThumbWidth   = $bitImg.width();
    var bitThumbX       = options.$bit.position().left;
    var bitThumbY       = options.$bit.position().top;
    var bitThumbZIndex  = options.$bit.zIndex();

    var mask            = $('.wipe.bit-preview .mask');

    var documentWidth   = $(document).width();

    /*
       Set up + calc the vars needed to animate

       When expanding, we use up the most of the viewport space
       to preview, as is available, after leaving some margin from the edges.
       We save the bit's thumbnail image height+width, and original x,y position in a session var
       so we can animate back on the contract
    */
    if (options.direction === "expand") {

      // faster than jQuery(window).width() via http://ryanve.com/lab/dimensions
      var availableHeight = document.documentElement.clientHeight;

      // use availableHeight to determine previewWidth
      if ((options.bit.nativeHeight > bitThumbHeight) &&
          (bitThumbHeight <= availableHeight)) {

        var previewHeight = availableHeight;

        /*
            Solve for the preview width:

             nativeHeight       previewHeight
            -------------  =  ----------------
             nativeWidth       x (previewWidth)
        */
        var previewWidth = Math.floor((options.bit.nativeWidth * previewHeight) / options.bit.nativeHeight);
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

          Also, account for scroll position in both directions
        */
        x: ((verge.viewportW() / 2) - (previewWidth / 2)) + verge.scrollX(),
        y: ((verge.viewportH() / 2) - (previewHeight / 2)) + verge.scrollY()
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
        y: Session.get('bitThumbY'),
        zIndex: Session.get('bitThumbZIndex')
      };
    }

    var timelineStart = function () {
      Parallels.log.debug('bit:preview timeline starting ...');

      // TODO: disable bit actions (drag, delete)

      // TODO: combine vars into one Session obj
      if (options.direction === "expand") {
        Session.set('bitThumbHeight', bitThumbHeight);
        Session.set('bitThumbWidth', bitThumbWidth);
        Session.set('bitThumbX', bitThumbX);
        Session.set('bitThumbY', bitThumbY);
        Session.set('bitThumbZIndex', bitThumbZIndex);

        Parallels.Audio.player.play('fx-quad-ripple');
      }

      else if (options.direction === "contract"){
        Session.set('bitThumbWidth', null);
        Session.set('bitThumbHeight', null);
        Session.set('bitThumbX', null);
        Session.set('bitThumbY', null);
        Session.set('bitThumbZIndex', null);

        Parallels.Audio.player.play('fx-temp-temp');
      }
    };

    var timelineDone = function( direction ){
      Parallels.log.debug("bit:preview: " , direction, " : tween done." );
    };

    var timeline = new TimelineMax({
      onStart: timelineStart,
      onComplete: timelineDone,
      onCompleteParams:[ options.direction ],
      paused: options.paused
    });

    if (options.direction === "expand") {
      Parallels.log.debug("expanding...");

      $("body").css( "overflow", "hidden"); // disabling scrolling
      // Parallels.log.debug("bitImgOptions: ", bitImgOptions);
      // Parallels.log.debug("bitContainerOptions: ", bitContainerOptions);

      timeline
        .set(options.$bit, { zIndex: 10000 })
        .set($('.wipe.bit-preview'), { alpha: 1, display: "block" })

        .set(mask,  { y: verge.scrollY(), x: verge.scrollX() }) // move mask into position outside the canvas
        .to(mask,  0.30, { opacity: 1,  x: verge.scrollX(), ease: Ease.circOut } )

        // blow up image from thumbnail size up to fit the viewport height
        // and move its container (and it) to position. Run simultaneously
        .to($bitImg, 0.20, bitImgOptions )
        .to(options.$bit, 0.20, bitContainerOptions, "-=0.20" );
    }

    else if (options.direction === "contract") {
      Parallels.log.debug("contracting...");

      $("body").css( "overflow", "visible"); // re-enabling scrolling

      timeline
        .to(mask,   0.30, { opacity: 0, x: 0, ease: Ease.circOut }, 0.15 )

        // contract image from viewport height down to original thumbnail size
        // run at the same time
        .to($bitImg, 0.20, bitImgOptions )
        .to(options.$bit, 0.20, bitContainerOptions, "-=0.20" )

        .set(options.$bit, { zIndex: bitContainerOptions.zIndex })
        .set($('.wipe.bit-preview'), { alpha: 0, display: "none" });
    }

    return timeline;
  },



  waveSlice: function(options){

  /*
    PURPOSE:
      Split an image into slices, and animate them as a wave

      Technique is a mashup of:
        * A: sine wave oscillation, maths adapted from: https://processing.org/examples/sinewave.html
        * B: a sliceAndDice demo adapted from https://stackoverflow.com/questions/27208715/webgl-animated-texture-performance-versus-canvas-drawimage-performance
        * C: interpolation of 2 images, like jiri kollar rollages
    -----------------------------------------------------------

    DOCS:
      /private/docs/wave-fx-wave-jiri-media-20150201.jpg

      https://trello.com/c/qmOaMksw/54-wave-rollage-animations-transitions-explores
    -----------------------------------------------------------

    OPTIONS/PARAMS:
      $img: a jquery obj of the img element to slice + animate
      prependTo: a jquery selector *string, of where to prepend canvas to

      // effect is meant for use on the main canvas, where this effect, 
      // once enabled, replaces the original static(non-animated) bit
      replaceBitOnCanvas: true
    -----------------------------------------------------------

    TODO:
      * make start + stop function, to ensure GC + good cleanup happens on objects used here
    -----------------------------------------------------------
  */

    var rect = options.$img[0].getClientRects()[0];

    // The mathematical constant with the value 6.28318530717958647693.
    // Twice the ratio of the circumference of a circle to its diameter (pi)
    // useful in combination with trig functions sin() and cos()
    var TWO_PI = 6.28318530717958647693;

    // in pixels
    // TODO: make more robust for HiDi displays, Retina
    var sliceWidth = 30;

    var imgWidth = parseInt(rect.width);
    var imgHeight = parseInt(rect.height);
    var numSlices = Math.round(imgWidth / sliceWidth);

     // Using an array to store height values for each slice of the wave
     // since it's all floats, we benefit from a typed array:
     // slighlty longer to init/load than a regular array
     // but faster across the rest of the operations, as
     // well be accessing it many times a second, inside of the RequestAnimationLoop
    var yvalues = new Float32Array(numSlices);

    // since wave oscillates up+down, the rendered slices will exceed the bounds
    // of the original image. We add extra margin top+bottom to the canvas to
    // avoid clipping
    // TODO: align canvas tighter/closer to original image
    // for seamless transition in/out animation
    var spillover = Math.round(imgHeight * 1.5);

    // Start angle
    var theta = 0;

    // Use a proportion of the imgWidth to
    // make the feeling consistent across diff image sizes
    var amplitude = Math.round(imgHeight * 0.1)   // Height of the wave
    var period = Math.round(imgWidth * 1);      // How many pixels before the wave repeats

    // The delta (change) of x, the height, of each slice:
    // a function of period and sliceWidth
    var dx = (TWO_PI / period) * sliceWidth;
    var canvas;
    var rafHandle = -1;

    // ************************** PREP CANVASES *****************************

    canvas                = document.createElement('canvas');
    canvas.height         = imgHeight + spillover;
    canvas.width          = imgWidth;

    // TODO: replace with transform positioning for better perf
    if (options.replaceBitOnCanvas){
      canvas.style.position = "absolute";
      canvas.style.left     = parseInt(rect.left)  + "px";
      canvas.style.top      = (parseInt(rect.top) - (spillover / 2)) + "px";
      canvas.style.zIndex   = 1;
    }

    $(canvas).prependTo(options.prependTo);

    var ctx               = canvas.getContext('2d');
    ctx.width             = imgWidth;
    ctx.height            = imgHeight;

    // OQ: do we need this?
    var frame             = document.createElement("canvas"); // "frame buffer"
    var fctx              = frame.getContext("2d");
    frame.width           = imgWidth;
    frame.height          = imgHeight;

    renderWaveSlices();

    return {
      rafHandle: rafHandle,
      canvas: canvas
    };

    function calcWavePoints() {

      // increase value for faster wave surge/fall
      theta += 0.05;

      // For every x value, calculate a y value with sine function
      var x = theta;

      _.each(yvalues, function(key, count) {
        // TODO: repeat, with less intensity, until stops
        yvalues[count] = Math.sin(x) * amplitude;
        x += dx;
      });
    }

    // TODO: pref improvement, if we move to web workers?
    // https://stackoverflow.com/questions/18987352/how-can-i-speed-up-this-slow-canvas-drawimage-operation-webgl-webworkers?rq=1
    function renderWaveSlices() {

      calcWavePoints();
      var pointArray = [];

      for (var sliceCount = 0; sliceCount < numSlices; sliceCount++) {
        var point = {
          x: sliceCount * sliceWidth,
          y: (imgHeight / 2) + yvalues[sliceCount]
        };
        pointArray.push(point);
      }

      fctx.drawImage(options.$img[0], 0, 0, imgWidth, imgHeight);
      ctx.imageSmoothingEnabled = true;

      // TODO: better perf if we kept track of last frame,
      // compared, and only cleared dirty areas using :
      // https://stackoverflow.com/questions/10019003/html5-how-to-draw-transparent-pixel-image-in-canvas#10021707
      // ?
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for(var x = 0; x < numSlices; x++) {

        // fill in what's new
        // TODO: how to add opacity to slices, to feel more like
        // a trail?
        ctx.drawImage(
          frame,

          // source slice
          (x * sliceWidth), 0, sliceWidth, frame.height,

          // dest. slice
          pointArray[x].x , pointArray[x].y, sliceWidth, imgHeight);
      }

      rafHandle = requestAnimationFrame(renderWaveSlices);
    }
  }
};
