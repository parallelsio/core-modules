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
      // $bitOrigin.addClass('dashed-stroke');

      // TODO:
      // disable events
      // try bg overlay over other bits too?
      // disable scrolling

      // TODO: make helper on Bit obj
      // var getBitCenterPoint function(){

      // }
      // var centerCoords = getCenterPointOfBit()


      // TODO : get working with Hammer

      function getRandomColor() {
        return 'rgb('
          + Math.floor(Math.random() * 255) + ','
          + Math.floor(Math.random() * 255) + ','
          + Math.floor(Math.random() * 255) + ')';
      }

      // var getEventPoint = function(event, svg){

      //     var point = {};

      //     // account for where the canvas sits, offset from 0,0
      //     point.x = (window.pageXOffset + event.clientX) - canvas.offsetLeft;
      //     point.y = (window.pageYOffset + event.clientY) - canvas.offsetTop;

      //     return point;
      //   }


      // set up an SVG container via two.js container to draw the line stroke
      var element = document.createElement('div');
      $(element)
        .addClass("create-parallel--line-container")
        .height( 5000 )
        .width( 5000)
        .prependTo(".map");

      var params = { 
        fullscreen: true
      };
      var two = new Two(params).appendTo(element);
    
      // Session.set('createParallelTwoInstance', two);

      console.log("bitData.position:" , bitData.position);

      // convenience method
      var line = two.makeLine(
        bitData.position.x, 
        bitData.position.y, 
        bitData.position.x + 100, 
        bitData.position.y + 100);

      line.linewidth = 5;
      line.stroke = getRandomColor();
      line.cap = line.join = 'round';

      // OQ: should we use Meteor binding?

      two.update();


      // two.bind("update", function(event){

      // });

      // two.play();

      // https://stackoverflow.com/questions/26850747/how-do-i-create-circular-hotspots-with-two-js
      line._renderer.elem.addEventListener('mousemove', function(event){
        log.debug("mouse event.page_: ", event.pageX, event.pageY);
        line.fill = getRandomColor();
      });



      // $(line._renderer.elem)
      //   .on( "mousemove", function(event) {
      //     line.fill = getRandomColor();
      //     log.debug("mouse event.page_: ", event.pageX, event.pageY);
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

      log.debug('parallel:create: exit mode');
    }
  }
};
