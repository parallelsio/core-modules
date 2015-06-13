/*

  OQ: 
    * is timeline.kill() the best way to gracefully end heartbeat animation on escape?

    * is enter/exit for this mode intuitive? shouldnt it be three?
      1. enter   2. cancel  3.  complete?
 */

// OQ: Are these global vars?
// TODO: to move these into mode, as object properties?
var timeline, $originBit;
var line, updatedLine, lineContainer, params, two, mouse, circle;

Parallels.AppModes['create-parallel'] = {

  enter: function () {
    log.debug("mode:create-parallel:enter");

    Session.set('currentMode', 'create-parallel');

    var originBitId = Session.get('bitHoveringId');
    Session.set('originBitId', originBitId);
    $originBit = $("[data-id='" + originBitId + "']" );
    var originBitData = Blaze.getData($originBit[0]);
    var originBitCenterX = originBitData.position.x + ($originBit[0].clientWidth / 2)
    var originBitCenterY = originBitData.position.y + ($originBit[0].clientHeight / 2)

    Parallels.KeyCommands.disableAll();
    Parallels.KeyCommands.bindEsc();

    // re-binding Shift, so if person hits it again,
    // we know they are have chosen a destination bit
    // and ready to commit this to the db/UI.
    Mousetrap.bind('shift', function (){
      log.debug("pressed 'Shift' key: looking to close parallel.");
      
      // get latest value of bit person is hovering over as destination bit.
      // this is expected to happen now that the origin has already been chosen
      var destBitId = Session.get('bitHoveringId'); 

      if (destBitId && (destBitId != originBitId)) {
        
        Session.set('destBitId', destBitId);
        log.debug(
          'closing parallel: source:', 
          originBitId, 
          " -> dest:", 
          destBitId);

        // TODO: call neo4j save

        // play 4 corner, spark animation, with sounds
        // see 
        /* 
          DOCS: 
          /private/docs/parallel-create-spark-animation-v1.png

        */

        // query Neo4j for image bits that are connected, by X number of hops

        // slice + dice images in collection
        // use these slices to fast / cycle / shimmer across these pieces as a wave

        // show form so person can define relationship
        // -- bind escape rids form, create-parallel mode
        // -- Later: autocomplete from collection of parallel types

        // play yay sound, connection stamp/re-enforcing/"hardening" animation 
        // not sure what this means yet

        // Session.set('isDrawingParallel', null);
        // Session.set('originBitId', null);

      }

    });


    log.debug("ready for creating parallel. starting at bit: " + originBitId);

    // TODO: abstract out into reusable mode concept.
    // here, it might be : enterMode.createParallel()
    $(".map").addClass('mode--create-parallel'); // visually demonstrate we're in connecting mode

    // TODO: animate
    $originBit.addClass('create-parallel--origin');

    // TODO:
    // try bg overlay over other bits too?

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
      mouse.x = verge.scrollX() + event.clientX;
      mouse.y = verge.scrollY() + event.clientY
    });    

    circle = two.makeCircle(
      originBitCenterX,  
      originBitCenterY, 
      2 // width
    );

    circle.noStroke().fill = 'blue';

    // By passing the circle.translation into the origin 
    // two.js automatically data binds the line (via Backbone
    // underneath it's hood). Whenever the data properties for 
    // circle updates in .bind below, the line destination data
    // (as an anchor/vector), updates too
    // https://github.com/jonobr1/two.js/issues/133
    var line = new Two.Polygon([
            circle.translation, // origin
            new Two.Vector(originBitCenterX, originBitCenterY)
        ]);

    line.noFill().stroke = 'yellow';
    line.linewidth = 7;
  
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
      log.debug('bit:parallel:create. Origin bit' + originBitId + ': selected-loop animation starting ...');
      // TODO: play sound indicating origin start, jeopardy jingle??
    };

    var timelineDone = function( bitOriginId ){
      log.debug('bit:parallel:create. End mode, origin bit' + bitOriginId + ': selected-loop animation ending.');
    };

    timeline = new TimelineMax({
      onStart: timelineStart,
      onComplete: timelineDone,
      onCompleteParams:[ originBitId ],
      repeat: -1
    });

    timeline
      .to($originBit, 0.50, { scale: 1.05, ease:Expo.easeOut } )
      .to($originBit, 0.5, { scale: 1, ease:Expo.easeOut } );
    // ****************** HEARTBEAT ANIMATION *************

  },

  exit: function () {
    log.debug("mode:create-parallel:exit");
    
    if (Session.get('currentMode')) {
      Session.set('currentMode', null);
      Session.set('originBitId', null);
      Session.set('destBitId', null);

      $(".map").removeClass('mode--create-parallel');
      
      $originBit.removeClass('create-parallel--origin');
      $('.create-parallel--line-container').remove();

      // stop heartbeat animation
      timeline.kill();

      $(window).off('mousemove');
      // stop drawing parallel line
      two.unbind('update');

      // reset vars for next create-parallel use
      lineContainer, params, two, mouse, updatedLine, line, circle = null;

      // TODO: remove the two instance. Very CPU drain as it drains on every re-init

      // reenable scrolling
      $("body").css( "overflow", "visible"); 
      $("body").css( "position", "static"); 

      // put key commands back to normal
      Parallels.KeyCommands.bindAll();
    }
  }
};
