
makeBitDraggable = function makeBitDraggable($bitElement){

  var timeline = new TimelineMax();
  
  // Adapted from: http://tympanus.net/Development/ElasticSVGElements/drag.html

  var zIndex = 0;
  var el = document.getElementById( 'drag-element-2' )
  var $shapeElement = el.querySelector( 'span.morph-shape' );

  var s = Snap( $shapeElement.querySelector( 'svg' ) );
  var pathElement = s.select( 'path' );
  var closingBox = pathElement.attr( 'd' ) 

  // // Needs to happen after position set, or else positions
  // // via manual transforms get overwritten by Draggable
  // // http://greensock.com/docs/#/HTML5/GSAP/Utils/Draggable
  var draggable = Draggable.create($bitElement, {

    throwProps:false,
    zIndexBoost:false,

    onDragStart:function(){

      // var x = this.endX;
      // var y = this.endY;
      // Parallels.log.debug(event.type, " : dragStart: ", x, " : ", y, " : ", this.getDirection("start"), " : ");
      Parallels.Audio.player.play('fx-cinq-drop');
    },

    onPress: function(event, pathElement, $bitElement){

      // TODO: improve performance
      // use image asset instead of CSS shadow:
      // https://stackoverflow.com/questions/16504281/css3-box-shadow-inset-painful-performance-killer

      $bitElement.addClass('is-dragging');

      // elastic stretch
      $bitElement.css('zIndex', 9999); // TODO: HACK: refactor

      pathElement.stop().animate( 
        {  'path' : $shapeElement.getAttribute( 'data-morph-active' )   }, 
        100, // speed 
        mina.easeinout // easing 
      );

      // TODO: ensure this happens only when in Draggable and mouse is held down
      // and not on regular taps/clicks of bit
      timeline.to($bitElement, 0.20, {
        scale: 1.05,
        boxShadow: "rgba(0, 0, 0, 0.2) 0 16px 32px 0",
        ease: Expo.easeOut
      });
    },

    onPressParams: [
      event,
      pathElement,
      $bitElement
    ],

    onRelease: function(event, pathElement, $bitElement){
      $bitElement.removeClass('is-dragging');

      // remove elastic stretch container
      ++zIndex;// TODO: z-index hack: refactor
      $bitElement.css('zIndex', zIndex);

      pathElement.stop().animate( 
        { 
          'path' : closingBox
        }, 
        800, // speed 
        mina.elastic // easing 
      );

      timeline.to(
        $bitElement,
        0.1,
        {
          scale: 1,
          boxShadow: "0",
          ease: Expo.easeOut
        }
      );
    },

    onReleaseParams: [
      event,
      pathElement,
      $bitElement
    ],

    onDragEnd:function( event ) {
      var x = this.endX;
      var y = this.endY;
      var mongoId = this.target.dataset.id;

      Meteor.call('changeState', {
        command: 'updateBitPosition',
        data: {
          canvasId: Session.get('canvasId'),
          _id: mongoId,
          position: { x: x, y: y }
        }
      });

      // a random tone, in the mid-range of the scale
      Parallels.Audio.player.play('tone--aalto-dubtechno-mod-' + _.random(4, 8));

      timeline.to($bitElement, 0.1, { scale: 1, boxShadow: "0", ease: Expo.easeOut });

    }


  });

  return draggable;
};
