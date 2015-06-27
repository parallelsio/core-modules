Parallels.Animation.General = {
  
  cornerSparks: function(options){

  /* 
    PURPOSE:
      Animate outward sparks, emitted from the center of each point.
      Sparks are chorographed to happen sequentially, with a slight overlap
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
      { x: parseInt(destBitRect.top),     y: parseInt(destBitRect.left),  freq: teoria.note('g2').fq() },
      { x: parseInt(destBitRect.top),     y: parseInt(destBitRect.right), freq: teoria.note('d2').fq() },
      { x: parseInt(destBitRect.bottom),  y: parseInt(destBitRect.left),  freq: teoria.note('c2').fq() },
      { x: parseInt(destBitRect.bottom),  y: parseInt(destBitRect.right), freq: teoria.note('a2').fq() }
    ];

    // TODO: set up Meteor.settings vars for map dimensions instead of hardcoding
    var particles = document.createElement('div');
    $(particles)
      .attr( "id", "corner-sparks--particles")
      .height( 5000 )
      .width( 5000)
      .prependTo(options.prependTo);

    var setupAndPlayCornerSpark = function(corner){
      // log.debug("setupAndPlayCornerSpark: ", corner);

      var spark = new particleEmitter({
        onStartCallback: function(){
          // log.debug("starting particleEmitter for corner: ", corner);
        },
        onStopCallback: function(){
          // log.debug("ending particleEmitter for corner: ", corner);
        },
        container: '#corner-sparks--particles',
        image: 'images/ui/particle.gif',
        center: [ corner.y, corner.x ], 
        size: 2, 
        velocity: 450, 
        decay: 500, 
        rate: 600
      });

      spark.start()
      var handle = Meteor.setTimeout(function(){
        spark.stop();
      },
      100);          
    }

    var tl = new TimelineMax({ paused:true });

    _.each(corners, function(corner, i) {
      var offsetDelay = i * 0.10;
      // log.debug("count:", i, ":", corner, ", delayed: ", offsetDelay);
      tl.call(setupAndPlayCornerSpark, [ corner ], this, offsetDelay );
    });


    tl.play();

  }

}