import _ from 'lodash';


makeBitDraggable = function makeBitDraggable($bitElement, $dragHandle){

  var timeline = new TimelineMax();
  var $bits = $(".bit");
  var overlapThreshold = "0%"; 
  var nearBitElement;
  var snapThreshold = 60; // in pixels

  // Needs to happen after position set, or else positions
  // via manual transforms get overwritten by Draggable
  // http://greensock.com/docs/#/HTML5/GSAP/Utils/Draggable
  var draggable = Draggable.create($bitElement, {
    trigger: $dragHandle,
    throwProps: false,
    zIndexBoost: false,
    autoScroll: 1,
    cursor: "inherit",

    // bounds:,
    // edgeResistance:0.65,
    // type:"x,y", // default?

    onPress: function(event){
    
      Parallels.Keys.unbindActions();

      // TODO: improve performance
      // use image asset instead of CSS shadow:
      // https://stackoverflow.com/questions/16504281/css3-box-shadow-inset-painful-performance-killer
      timeline
        .to($bitElement, 
          0.10, 
          {
            scale: 1.05,
            boxShadow: "rgba(0, 0, 0, 0.2) 0 16px 32px 0",
            ease: Expo.easeOut
        })
        .to($bitElement.find('.bit__drag-handle'), 0.1, { scale: 1.5, opacity: "0.1", ease: Expo.easeOut }), "-=0.10";

        $bitElement.addClass('dragging');
    },

    onRelease: function(event){

      Parallels.Keys.bindActions();
      
      timeline
        .to($bitElement, 0.1, { scale: 1, boxShadow: "0", ease: Expo.easeOut })
        .to($bitElement.find('.bit__drag-handle'), 0.1, { scale: 1, opacity: "1", ease: Expo.easeOut }), "-=0.10";
   
      $bitElement.removeClass('dragging');

    },

    onDragStart:function(event){

      // Parallels.log.debug(event.type, " : dragStart: ", x, " : ", y, " : ", this.getDirection("start"), " : ");
      Parallels.Audio.player.play('fx-cinq-drop');

      // TODO: improve performance
      // use image asset instead of CSS shadow:
      // https://stackoverflow.com/questions/16504281/css3-box-shadow-inset-painful-performance-killer

      // TODO: ensure this happens only when in Draggable and mouse is held down
      // and not on regular taps/clicks of bit
      // timeline

    },

    onDrag: function(e) {
      var dragBitRect = $($bitElement)[0].getClientRects()[0];
      // console.log(dragBitRect);

      // loop through all bits, and run a hit test on each one against dragging bit
      // TODO: restrict search to only what's visible in viewport, via Verge?
      var nearBitCount = 0;
      for(var i = 0; i < $bits.length; i++){
    
        if (this.hitTest($bits[i], overlapThreshold))  {
          nearBitElement = $bits[i];
          nearBitCount = nearBitCount + 1;
          showSnapGuides();
        }
      }

      if (nearBitCount === 0){
        nearBitElement = null;
        clearAllGuides();
      }

      else if (nearBitCount > 1) {
        // TODO: handle this case, clear nearBit?
        console.log('more than 1 bit to snap: not sure which to pick');
        clearAllGuides();
      }
    },



    onDragEnd:function( event ) {
      var x = this.endX;
      var y = this.endY;
      if (nearBitElement) {
        var nearBitRect = $(nearBitElement)[0].getClientRects()[0];
      }
      var dragBitRect = $bitElement[0].getClientRects()[0];

      // snap to nearest bit
      // via http://greensock.com/forums/topic/9265-draggable-snapping-to-specific-points-with-sensitivity/


      // if snapping was set, get the new snap position
      if ($(nearBitElement).hasClass('near--top')){
        y = (nearBitRect.top - dragBitRect.height) + verge.scrollY();
        $(nearBitElement).removeClass("near--top");
      }

      else if ($(nearBitElement).hasClass('near--bottom')){
        y = (nearBitRect.bottom) + verge.scrollY();
        $(nearBitElement).removeClass("near--bottom");
      }

      TweenLite.to($bitElement, 0.1, { x: parseInt(x), y: parseInt(y), ease: Circ.easeOut });
      var mongoId = this.target.dataset.id;

      // timeline.to(
      //   $bitElement,
      //   0.1,
      //   {
      //     scale: 1,
      //     boxShadow: "0",
      //     ease: Expo.easeOut
      //   }
      // );

      // save new position to db
      Meteor.call('changeState', {
        command: 'updateBitPosition',
        data: {
          canvasId: Session.get('canvasId'),
          _id: mongoId,
          position: { x: x, y: y }
        }
      });

      // a random tone from the series, in the mid-range of the scale
      Parallels.Audio.player.play('tone--aalto-dubtechno-mod-' + _.random(4, 8));

      // animate out dragging shadow
      timeline
        .to($bitElement, 0.1, { scale: 1, boxShadow: "0", ease: Expo.easeOut })
        .to($bitElement.find('.bit__drag-handle'), 0.05, { scale: 1, opacity: "1", ease: Expo.easeOut })

      $bitElement.removeClass('dragging');
      nearBitElement = null;
      clearAllGuides();
    }

  });

  return draggable;

  function clearAllGuides(){
    $(".near--bottom").removeClass("near--bottom");
    $(".near--top").removeClass("near--top");
    $(".near--left").removeClass("near--left");
    $(".near--right").removeClass("near--right");
  }

  function showSnapGuides(){
    var nearBitRect = $(nearBitElement)[0].getClientRects()[0];
    var dragBitRect = $bitElement[0].getClientRects()[0];

    // console.log('-----------');
    // console.log("nearbit: ", nearBitElement.id, " : ", nearBitRect);
    // console.log("dragBit: ", $bitElement.id, " : ", dragBitRect);
    // console.log('-----------');

    // show bottom snap guide
    if (dragBitRect.top > (nearBitRect.bottom - snapThreshold)){
      $(nearBitElement).addClass("near--bottom");
      $(nearBitElement).removeClass("near--top");
    }

    // show top snap guide
    if (dragBitRect.bottom < (nearBitRect.top + snapThreshold)){
      $(nearBitElement).addClass("near--top");
      $(nearBitElement).removeClass("near--bottom");
    }
  }


};




