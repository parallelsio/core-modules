
Parallels.Animation = {
  
  scaleImage: function(options){

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

      bitData: bitData,
      $bit: $bit,
      bitTemplate: bitTemplate,
      direction: "expand" | "contract"
    -----------------------------------------------------------
    
    TODO: 
      * pass one bit object, get the other things from it, 
        versus passing 3 diff parts of similar objects
    
      * refactor: combine bit references, 
        and dont go to Session store for original height/width

      * refactor, break up into mode/enter + mode/exit?
    -----------------------------------------------------------
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
      destBitRect: destBitRect // object with .top, .left, etc
      prependToString: ".map" // a jquery selector string
      imgElementToSlice:  $destBit.find('img')[0]
    -----------------------------------------------------------
    
    TODO: 
      * 
    -----------------------------------------------------------
  */

    // ************************** INIT VARS *****************************

    // The mathematical constant with the value 6.28318530717958647693. 
    // Twice the ratio of the circumference of a circle to its diameter (pi)
    // useful in combination with trig functions sin() and cos()
    var TWO_PI = 6.28318530717958647693;

    // in pixels
    // TODO: make more robust for HiDi displays, Retina
    var sliceWidth = 15; 

    // we already calculated the bounding rectangle earlier,
    // when we ran the spark animation
    // lets reuse the coords to calc our bit dimensions
    // the same size as the thumbnail image
    var bitWidth = parseInt(options.destBitRect.width);
    var bitHeight = parseInt(options.destBitRect.height);
    var numSlices = Math.round(bitWidth / sliceWidth);

     // Using an array to store height values for each slice of the wave
     // since it's all floats, we benefit from a typed array:
     // slighlty longer to init/load than a regular array
     // but faster across the rest of the operations.
     // well be accessing it many times a second, inside of the RequestAnimationLoop
    var yvalues = new Float32Array(numSlices);  

    // since wave oscillates up+down, therendered slices will exceed the boounds
    // of the original image. We add extra margin top+bottom to the canvas to
    // avoid clipping
    var spillover = Math.round(bitHeight * 1.5);

    // Start angle 
    var theta = 0;        

    // Use a proportion of the bitWidth to 
    // make the feeling consistent across diff bit sizes
    var amplitude = Math.round(bitHeight * 0.1)   // Height of the wave
    var period = Math.round(bitWidth * 0.8);      // How many pixels before the wave repeats
    
    // The delta (change) of x, the height, of each slice:
    // a function of period and sliceWidth
    var dx = (TWO_PI / period) * sliceWidth;   
    var canvas;
    var rafHandle = -1;

    // ************************** PREP CANVASES *****************************

    canvas = document.createElement('canvas');
    canvas.height = bitHeight + spillover;
    canvas.width = bitWidth;
    canvas.style.border = "1px dotted green";
    canvas.style.position = "absolute";

    // TODO: replace with transform positioning for better perf
    canvas.style.left = parseInt(options.destBitRect.left)  + "px";
    canvas.style.top =  (parseInt(options.destBitRect.top) - (spillover / 2)) + "px";
    canvas.style.zIndex =  1;

    $(canvas).prependTo(options.prependToString);

    var ctx = canvas.getContext('2d');
    ctx.width = bitWidth;
    ctx.height = bitHeight;

    // OQ: do we need this?
    var frame = document.createElement("canvas"); // "frame buffer"
    var fctx = frame.getContext("2d");
    frame.width = bitWidth;
    frame.height = bitHeight;

    renderWaveSlices();
    
    return rafHandle;

    function calcWavePoints() {
      // the speed the wave rocks. Increase for faster.
      theta += 0.2;

      // For every x value, calculate a y value with sine function
      var x = theta;

      _.each(yvalues, function(key, count) {
        // TODO: repeat, with less intensity, until stops
        yvalues[count] = Math.sin(x) * amplitude;
        x += dx;
      });
    }

    // TODO: pref improvement if we move to web workers?
    // https://stackoverflow.com/questions/18987352/how-can-i-speed-up-this-slow-canvas-drawimage-operation-webgl-webworkers?rq=1
    function renderWaveSlices() {

      calcWavePoints();
      var pointArray = [];

      for (var sliceCount = 0; sliceCount < numSlices; sliceCount++) {
        var point = {
          x: sliceCount * sliceWidth,
          y: (bitHeight / 2) + yvalues[sliceCount]
        };
        pointArray.push(point);
      }

      fctx.drawImage(options.imgElementToSlice, 0, 0, bitWidth, bitHeight); 
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
        ctx.drawImage(frame, 
                      (x * sliceWidth), 0, sliceWidth, frame.height,   // source slice
                      pointArray[x].x , pointArray[x].y, sliceWidth, bitHeight);    // dest. slice
      }

      rafHandle = requestAnimationFrame(renderWaveSlices);
    }
  

  }

};
