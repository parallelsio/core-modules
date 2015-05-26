var timeline, $bitOrigin;

function getRandomColor() {
  return 'rgb('
    + Math.floor(Math.random() * 255) + ','
    + Math.floor(Math.random() * 255) + ','
    + Math.floor(Math.random() * 255) + ')';
}

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
      // $bitOrigin.addClass('dashed-stroke');

      // TODO:
      // disable events
      // try bg overlay over other bits too?
      // disable scrolling

      // TODO: make helper on Bit obj
      // var getBitCenterPoint function(){

      // }
      

      // TODO : get working with Hammer

      // set up an SVG container via two.js container to draw the line stroke
      var element = document.createElement('div');
      $(element)
        .addClass("create-parallel--line-container")
        .height( 5000 )
        .width( 5000)
        .prependTo(".map");

      var params = { 
        fullscreen: true,
        autostart: true
      };
      var two = new Two(params).appendTo(element);
      var mouse = new Two.Vector();

      // OQ: should we use Meteor binding? 
      // https://stackoverflow.com/questions/21486667/meteor-js-how-should-i-bind-events-to-the-window-in-meteor
       $(window).on('mousemove', function(event){
          log.debug("mouse event.page_: ", event.pageX, event.pageY);
          mouse.x = window.pageXOffset + event.clientX;
          mouse.y = window.pageYOffset + event.clientY
        });

      // TODO: originate line from center point of bit, so it looks right
      // as person moves mouse around: var centerCoords = getCenterPointOfBit()
      // destination vector is will be overridden on first
      // update by mouse position and won't be visible.
      var line = two
        .makeLine( 
          bitData.position.x,
          bitData.position.y,
          bitData.position.x, 
          bitData.position.y
        )
        line.linewidth = 15;
        line.cap = line.join = 'round';
      
      two.bind('update', function(frameCount) {
        /*  OQ: why doesnt this work?
            var endAnchor = new Two.Anchor(mouse.x, mouse.y);
            line.vertices[1] = endAnchor;
        */

        // OQ: is this the best strategy for this?
        two.clear();

        var newLine = two
          .makeLine( 
            bitData.position.x,
            bitData.position.y,
            mouse.x, 
            mouse.y
          )
        newLine.linewidth = 15;
        newLine.cap = line.join = 'round';
        

        // TODO: depending on direction on direction parallel is pointing,
        // addClass(left);

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
      // $bitOrigin.removeClass('dashed-stroke');
      $('.create-parallel--line-container').remove();

      // stop heartbeat animation
      timeline.kill();

      // TODO: remove all two instances

      $(window).off("mousemove");

      log.debug('parallel:create: exit mode');
    }
  }
};
