var timeline, $bitOrigin;

/*
 TODO:

 * syncronize multiple bits heartbeat animation
 * is timeline.kill() the best way to gracefully end heartbeat animation on escape?

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
      // var svg = document.createElement('svg');
      // $(svg).addClass("parallel-line-container");
      // $('.map').prepend(svg);

      var s = Snap("#create-parallel--line");
      var bigCircle = s.circle(150, 150, 100);
      
      // var path = s.path("M94.2,265.7L82,203.4c43.3-15.6,83.8-29.2,137.1-20.2c61.5-27.6,126.1-56.9,202.6 46.1c18.7,18.9,21.5,39.8,12.2,62.3C322.7,231.9,208.2,247.6,94.2,265.7z");

      // path.animate({ d: "M179.4,83.5l62.4-11.8c15.3,43.4-76,102.6-22.6,111.5c61.5-27.6,126.1-56.9,202.6-46.1c18.7,18.9,21.5,39.8,12.2,62.3C250.6,296.7,52.4,259.2,179.4,83.5z" }, 1000, mina.bounce);
      
      // s
      //   .line(
      //     bitData.position.x, 
      //     bitData.position.y, 
      //     bitData.position.x + 100, 
      //     bitData.position.y + 100)
      //   .attr({
      //     fill: "none",
      //     stroke: "#bada55",
      //     strokeWidth: 5
      //   });

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
      $('#create-parallel--line').remove();

      // stop heartbeat animation
      timeline.kill();

      log.debug('exiting create parallel mode complete');
    }
  }
};
