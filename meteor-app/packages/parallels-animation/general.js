// TODO: move dependencies into this Atmosphere package.js
// depends on mojs package
// https://guide.meteor.com/writing-atmosphere-packages.html#npm-dependencies

Parallels.Animation.General = {

  shimmer: function (options) {
    /*
     PURPOSE:
     Set up a timeline for revealing a collection of DOM elements,
     in a choreographed sequence, slightly staggered.

     Adapted from: http://codepen.io/GreenSock/pen/ramJGv
     -----------------------------------------------------------

     PARAMS:
     $elements: a collection of DOM elements to shimmer, $(".map .bit")
     paused: true | false
     -----------------------------------------------------------

     RETURNS: reference to Greensock timeline, for chaining or later play
     -----------------------------------------------------------

     TODO: only shimmer + play sounds for what is in the viewport
     -----------------------------------------------------------
     */

    var delayMultiplier = 0.0005;
    var duration = 0.4;
    var timeline = new TimelineMax({
      paused: false || options.paused
    });

    options.$elements.each(function () {

      $element = this;

      // Use the Greensock-applied transform values via "translate3d(132px, 89px, 0px)"
      // Use utility function to get position, as jQuery position wont work,
      // bc elements are currently not visible
      var position = Utilities.getTransformedPosition($element);

      // We need the x/y coordinates to pass to the Timeline obj,
      // which will use the distance between the bits to calc a delay offset
      // this delay offset is what gives it a nice wipe/shimmering effect
      var offset = parseFloat(position.top) + parseFloat(position.left);
      var delay = parseFloat(offset * delayMultiplier).toFixed(2);

      // Parallels.log.debug("shimmer:in: ", Utilities.getBitDataId($element), " : delay of ", delay);

      /* TODO:
       calc a sound frequency to use as a parameter for the sound played
       Using the delay param we used above for the animation will tie
       the 2 together nicely
       var newFreq = Math.random() * 1000 + 1060;
       newFreq = newFreq * (delay + 100);  // TODO: lose precision, unecessary?
       */

      // Parallels.log.debug("sound freq for bit: ", newFreq, ". Animation delay: ", delay);
      // bitDragAudioInstance = Parallels.Audio.player.play('elasticStretch');
      // bitDragAudioInstance.set("elasticStretch.source.freq", newFreq);

      timeline.fromTo(
        $element,
        duration,
        {
          // from
          scale: 0.95,
          opacity: 0,
          ease: Expo.easeIn,
          display: 'block'
        },
        {
          // to
          scale: 1,
          opacity: $element.style.opacity && $element.style.opacity > 0 ? $element.style.opacity : 1,
          ease: Expo.easeIn,
          display: 'block',

          onComplete: function () {
            // TODO: vary this sound (pitch up?) after each iteration
            Parallels.Audio.player.play('fx-ting3');
          }
        },
        delay
      );

    });

    if (!options.paused) {
      timeline.play();
    }

    return timeline;
  },

  morphLightbox: function (options) {

    /*
     PURPOSE:
     Display a full screen view, morphed from an element.
     Use Greensock for animation choreography, vs CSS.

     Inspired by http://tympanus.net/Development/MorphingSearch
     -----------------------------------------------------------

     OPTIONS/PARAMS:

     $element:   // jQuery object to the element to morph from
     -----------------------------------------------------------

     TODO:
     -----------------------------------------------------------
     */

    var duration = 0.2;
    var delay = 0;

    var $viewElement;

    var timeline = new TimelineMax({
      // paused: false || options.paused
    });

    timeline.to(
      options.$element,
      duration,
      {
        // to
        scale: 1,
        opacity: 1,
        ease: Expo.easeIn,
        display: 'block',

        onComplete: function () {
          Parallels.Audio.player.play('fx-ting3');
        }
      },
      delay
    );

    return timeline;

  },

  cornerSparks: function (options) {

    /*
     PURPOSE:
     Animate outward sparks, emitted from the center of each point.
     Sparks are choreographed to happen sequentially, with a slight overlap
     -----------------------------------------------------------

     DOCS:
     /private/docs/parallel-create-spark-animation-v1.png

     Sketch of sparks ordering, and accomponieng musical notes
     -----------------------------------------------------------

     OPTIONS/PARAMS:
     $element:   // jQuery object to the element to receive sparks
     prependTo:  // jQuery selector string, of DOM element to prepend the particles container to
     -----------------------------------------------------------

     TODO:
     * convert animations to use RequestAnimationFrame for better perf
     * experiment with using <canvas> instead of DOM, for better perf
     * include End function in here
     -----------------------------------------------------------
     */

    var destBitRect = options.$element[0].getClientRects()[0];
    var corners = [
      {x: parseInt(destBitRect.top), y: parseInt(destBitRect.left), freq: teoria.note('g2').fq()},
      {x: parseInt(destBitRect.top), y: parseInt(destBitRect.right), freq: teoria.note('d2').fq()},
      {x: parseInt(destBitRect.bottom), y: parseInt(destBitRect.left), freq: teoria.note('c2').fq()},
      {x: parseInt(destBitRect.bottom), y: parseInt(destBitRect.right), freq: teoria.note('a2').fq()}
    ];

    // TODO: set up Meteor.settings vars for map dimensions instead of hardcoding
    var particles = document.createElement('div');
    $(particles)
      .attr("id", "corner-sparks--particles")
      .height(Session.get("mapHeight"))
      .width(Session.get("mapWidth"))
      .prependTo(options.prependTo);

    var setupAndPlayCornerSpark = function (corner) {
      // Parallels.log.debug("setupAndPlayCornerSpark: ", corner);

      var spark = new particleEmitter({
        onStartCallback: function () {
          // Parallels.log.debug("starting particleEmitter for corner: ", corner);
        },
        onStopCallback: function () {
          // Parallels.log.debug("ending particleEmitter for corner: ", corner);
        },
        container: '#corner-sparks--particles',
        image: 'images/ui/particle.gif',
        center: [corner.y, corner.x],
        size: 2,
        velocity: 450,
        decay: 500,
        rate: 600
      });

      spark.start()
      var handle = Meteor.setTimeout(function () {
          spark.stop();
        },
        100);
    }

    var tl = new TimelineMax({paused: true});

    _.each(corners, function (corner, i) {
      var offsetDelay = i * 0.10;
      // Parallels.log.debug("count:", i, ":", corner, ", delayed: ", offsetDelay);
      tl.call(setupAndPlayCornerSpark, [corner], this, offsetDelay);
    });


    tl.play();

  },

  poof: function (options){

    // setting defaults, if not passed in
    options.speed = options.speed || 1;
    options.direction = options.direction || "forward";
    options.debug = options.debug || false;

    /*
     PURPOSE:
     Displays poof, with sparks. Animate outward sparks from a center point
     -----------------------------------------------------------

     OPTIONS/PARAMS:
     seedPoint:  object: x,y point of animation center/seed point
     direction:  string: "forward" or "backward"
     speed:      int: multiplier, passed into timeline object for how fast/slow to play animation
     
     -----------------------------------------------------------

     TODO:
     -----------------------------------------------------------
     - make colors part of options
     - create re-usable instances, vs adding/removing fx from DOM/ https://github.com/legomushroom/mojs/issues/62

     */

    // Adapted by combining elements from:
    // ---- https://codepen.io/sol0mka/full/03e9d8f2fbf886aa1505c61c81d782a0/
    // ---- https://codepen.io/sol0mka/pen/AXRAkg
    var burst = new mojs.Burst({
      left:           0, 
      top:            0,
      count:          8,
      radius:         { 50 : 150 },
      children: {
        shape:        'line',
        stroke:       [ 'white', '#FFE217', '#FC46AD', '#D0D202', '#B8E986', '#D0D202' ],
        scale:        1,
        scaleX:       { 1 : 0 },
        degreeShift:  'rand(-90, 90)',
        radius:       'rand(20, 40)',
        delay:        'rand(0, 150)',
        // pathScale:    'rand(.5, 1.25)',
        // duration:     200,
        isForce3d:    true,
        isShowEnd:    false
      }
    });

    // If debugger is on, show mojs workflow tools https://vimeo.com/185587462
    // otherwise, default to designed easing curve
    // TODO: this is buggy, and causing crashing on multiple sequential actions
    if (options.debug){
      var cloudChildrenCurve = new MojsCurveEditor({ 
        isSaveState: false, 
        name: 'cloudChildrenCurve' + _.random(0, 9999999999) 
      });

      var easeValue = cloudChildrenCurve.getEasing();
      $('#js-mojs-player').css({ zIndex: 100000 });
    }

    else {
      var easeValue = 'sin.in';
    }

    var cloud = new mojs.Burst({
      left:     0, 
      top:      0,
      radius:   { 4 : 49 },
      angle:    45,
      count:    12,
      children: {
        radius:       8,
        fill:         'white',
        scale:        { 
                          1 : 0,  // from value : to value
                          easing: easeValue
        },
        pathScale:    [ .7, null ],
        degreeShift:  [ 13, null ],
        duration:     [ 500, 700 ],
        isShowEnd:    false,
        isForce3d:    true
      }
    });

    var timeline = new mojs.Timeline({
      speed: options.speed, 
      
      onPlaybackComplete: function(){
        $(this.el).remove();
      }
    });

    timeline.add( cloud, burst );

    cloud.tune(options.seedPoint);
    burst
      .tune(options.seedPoint)
      .generate()
    
    if (options.direction === "forward"){
      timeline.replay(); 
    }

    else if (options.direction === "backward"){
      timeline.replayBackward();
    }

    if (options.debug) { new MojsPlayer({ add: timeline }); };

    return timeline; // if it's needed, for chaining
  }

}
