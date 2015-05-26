function getRandomColor() {
  return 'rgb('
    + Math.floor(Math.random() * 255) + ','
    + Math.floor(Math.random() * 255) + ','
    + Math.floor(Math.random() * 255) + ')';
}
var timeline, $bitOrigin;
var line, updatedLine, lineContainer, params, two, mouse, circle;


/*
  TODO:

    * syncronize multiple bits heartbeat animation
    * is timeline.kill() the best way to gracefully end heartbeat animation on escape?

  OQ: 

    is enter/exit for this mode intuitive? shouldnt it be three?
    1. enter   2. cancel  3.  complete?
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
      var bitCenterX = bitData.position.x + ($bitOrigin[0].clientWidth / 2)
      var bitCenterY = bitData.position.y + ($bitOrigin[0].clientHeight / 2)
  
      Session.set('isCreatingParallel', isCreatingParallel);
      Session.set('bitParallelCreateOriginId', bitParallelCreateOriginId);

      log.debug("ready for creating parallel. starting at bit: " + bitParallelCreateOriginId);

      // TODO: abstract out into reusable mode concept.
      // here, it might be : enterMode.createParallel()
      $(".map").addClass('mode--create-parallel'); // visually demonstrate we're in connecting mode

      // TODO: animate
      $bitOrigin.addClass('dashed-stroke');

      // TODO:
      // disable events
      // try bg overlay over other bits too?
      // disable scrolling



      // ****************** RENDER LINE *************
      // set up an SVG container via two.js container to draw the line stroke
      lineContainer = document.createElement('div');
      $(lineContainer)
        .addClass("create-parallel--line-container")
        .height( 5000 )
        .width( 5000)
        .prependTo(".map");

      params = { 
        fullscreen: true,
        autostart: true
      };

      two = new Two(params).appendTo(lineContainer);
      mouse = new Two.Vector();

      // OQ: should we use Meteor binding? 
      // https://stackoverflow.com/questions/21486667/meteor-js-how-should-i-bind-events-to-the-window-in-meteor
      $(window).on('mousemove', function(event){
        mouse.x = window.pageXOffset + event.clientX;
        mouse.y = window.pageYOffset + event.clientY
      });

      circle = two.makeCircle(
        bitCenterX,  
        bitCenterY, 
        2 // width
      );

      circle.noStroke().fill = 'blue';

      // by passing the circle.translation into the origin 
      // two.js automatically data binds the line,
      // so whenever the circle updates in .bind below,
      // line destination updates too.
      // https://github.com/jonobr1/two.js/issues/133
      var line = new Two.Polygon([
              circle.translation, // origin
              new Two.Vector(bitCenterX, bitCenterY)
          ]);

      line.noFill().stroke = 'yellow';
      line.linewidth = 15;
      line.cap = 'round';
    
      two
        .add(line)
        .bind('update', function(frameCount) {
          circle.translation.set(mouse.x, mouse.y);

          // TODO: the longer the distance, the thinner the linewidth
          
          // TODO: depending on direction on direction parallel is pointing,
          // addClass(left);

          // TODO: stretch sound, bind to flocking

        });
      // ****************** RENDER LINE *************


      // ****************** HEARTBEAT ANIMATION *************
      var timelineStart = function () {
        log.debug('bit:parallel:create. Origin bit' + bitParallelCreateOriginId + ': selected-loop animation starting ...');
      };

      var timelineDone = function( bitOriginId ){
        log.debug('bit:parallel:create. End mode, origin bit' + bitOriginId + ': selected-loop animation ending.');
      };

      timeline = new TimelineMax({
        onStart: timelineStart,
        onComplete: timelineDone,
        onCompleteParams:[ bitParallelCreateOriginId ],
        repeat: -1
      });

      timeline
        .to($bitOrigin, 0.50, { scale: 1.05, ease:Expo.easeOut } )
        .to($bitOrigin, 0.5, { scale: 1, ease:Expo.easeOut } );
      // ****************** HEARTBEAT ANIMATION *************




    }

    // play sound indicating origin start

    // set up bind shift key again, to complete parallel connection
    // in callback:

      // if were hovering on a bit other than origin

      // // play spark animation

      // save destination bit id to session
    
      // play yay sound

      // call neo4j save

      // show form, allow person to continue, escape rids form

              // Session.set('isDrawingParallel', null);
        // Session.set('bitParallelCreateOriginId', null);

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
      $('.create-parallel--line-container').remove();

      // stop heartbeat animation
      timeline.kill();

      // TODO: remove all two instances
      two.unbind('update');
      $(window).off('mousemove');
      lineContainer, params, two, mouse, updatedLine, line, circle = null;


      log.debug('parallel:create: exit mode');
    }
  }
};
