var timeline, $bitOrigin;

/*
 TODO:

 * syncronize multiple bits heartbeat animation
 * is timeline.kill() the best way to gracefully end heartbeat animation on escape

 */
Parallels.AppModes['create-parallel'] = {
  enter: function () {
    Session.set('currentMode', 'create-parallel');

    var bitHoveringId = Session.get('bitHoveringId');
    var isCreatingParallel = Session.get('isCreatingParallel');

    if(bitHoveringId && (!isCreatingParallel))
    {
      isCreatingParallel = true;
      var bitParallelCreateOriginId = bitHoveringId;
      $bitOrigin = $("[data-id='" + bitParallelCreateOriginId + "']" );
      var bitData = Blaze.getData($bitOrigin[0]);

      Session.set('isCreatingParallel', isCreatingParallel);
      Session.set('bitParallelCreateOriginId', bitParallelCreateOriginId);

      log.debug("ready for creating parallel. starting at bit: " + bitParallelCreateOriginId);

      // abstract out into reusable mode concept.
      // here, it might be : enterMode.createParallel()
      $(".map").addClass('mode--create-parallel'); // visually demonstrate we're in connecting mode

      // TODO: animate
      $bitOrigin.addClass('dashed-stroke');
      // TODO:
      // disable events
      // fix offset from adding stroke
      // try bg overlay over other bits too?
      // disable scrolling

      // TODO: make helper on Bit obj
      // var getBitCenterPoint function(){

      // }
      // var centerCoords = getCenterPointOfBit()

      // set up a container to draw the line stroke
      var svg = document.createElement('svg');
      $(svg).addClass("parallel-line-container");
      $(svg).attr(height, 5000);
      $(svg).attr(width, 5000);
      $('.map').prepend(svg);

      var s = Snap(800,700);
      s
        .line(
          bitData.position.x, 
          bitData.position.y, 
          bitData.position.x + 100, 
          bitData.position.y + 100)
        .attr({
          fill: "none",
          stroke: "#bada55",
          strokeWidth: 5
        });

      var timelineStart = function () {
        log.debug('bit:parallel:create. Origin bit' + bitParallelCreateOriginId + ': selected-loop animation starting ...');
      };

      var timelineDone = function( bitOriginId ){
        log.debug('bit:parallel:create. End mode, origin bit' + bitOriginId + ': selected-loop animation ending.');
        // Session.set('isDrawingParallel', null);
        // Session.set('bitParallelCreateOriginId', null);

        // $(this).unbind();

      };

      timeline = new TimelineMax({
        onStart: timelineStart,
        onComplete: timelineDone,
        onCompleteParams:[ bitParallelCreateOriginId ],
        repeat: -1
      });

      timeline
        // play heartbeat animation
        .to($bitOrigin, 0.50, { scale: 1.02, ease:Expo.easeOut } )
        .to($bitOrigin, 0.5, { scale: 1, ease:Expo.easeOut } );

      // draw line

      // TODO: only enable if none others are going

      // TODO: move to map? merge map.js + app.js?

      // $(this).mousemove( function(event) {
      //   log.debug("mouse event.page_: ", event.pageX, event.pageY);
      // });
    }
  },
  exit: function () {
    Session.set('currentMode', null);

    log.debug('escape key, inside create parallel, exiting mode');

    var isCreatingParallel = Session.get('isCreatingParallel');

    if (isCreatingParallel)
    {
      Session.set('isCreatingParallel', null);
      Session.set('bitParallelCreateOriginId', null);

      $(".map").removeClass('mode--create-parallel');
      $bitOrigin.removeClass('dashed-stroke');
      $('.parallel-line-container').remove();

      // stop heartbeat animation
      timeline.kill();

      log.debug('exiting create parallel mode complete');
    }
  }
};
