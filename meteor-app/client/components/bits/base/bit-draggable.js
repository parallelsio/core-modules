import _ from 'lodash';


makeBitDraggable = function makeBitDraggable($bitElement, $dragHandle){

  var timeline = new TimelineMax();
  var $bits = $(".bit");
  var overlapThreshold = "0%"; 
  var nearBit;
  var snapThreshold = 60; // in pixels
  // var dragSnapSelectedId;

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
      timeline
        .to($bitElement, 0.1, { scale: 1, boxShadow: "0", ease: Expo.easeOut })
        .to($bitElement.find('.bit__drag-handle'), 0.1, { scale: 1, opacity: "1", ease: Expo.easeOut }), "-=0.10";
   
      $bitElement.removeClass('dragging');

    },

    onDragStart:function(event){

      // var x = this.endX;
      // var y = this.endY;
      // Parallels.log.debug(event.type, " : dragStart: ", x, " : ", y, " : ", this.getDirection("start"), " : ");
      Parallels.Audio.player.play('fx-cinq-drop');

      // TODO: improve performance
      // use image asset instead of CSS shadow:
      // https://stackoverflow.com/questions/16504281/css3-box-shadow-inset-painful-performance-killer

      // TODO: ensure this happens only when in Draggable and mouse is held down
      // and not on regular taps/clicks of bit
      // timeline
      //   .to($bitElement, 0.20, {
      //     scale: 1.05,
      //     boxShadow: "rgba(0, 0, 0, 0.2) 0 16px 32px 0",
      //     ease: Expo.easeOut
      //   });

        // .to($bitElement.find('.bit__drag-handle'), 0.1, { scale: 1.5, opacity: "0.1", ease: Expo.easeOut })

    },

    onDrag: function(e) {
      var dragBitRect = $($bitElement)[0].getClientRects()[0];
      console.log(dragBitRect);

      // loop through all bits, and run a hit test on each one against dragging bit
      // TODO: restrict search to only what's visible in viewport, via Verge?
      var nearBitCount = 0;
      for(var i = 0; i < $bits.length; i++){
    
        if (this.hitTest($bits[i], overlapThreshold))  {
          // if (!dragSnapSelectedId) { bits[i].id };
          showSnapGuides($bits[i], this.target);
          nearBit = $bits[i];
          
          var nearBitRect = $(nearBit)[0].getClientRects()[0];
          nearBitCount = nearBitCount + 1;
        }
      }

      if (nearBitCount > 1){
        // TODO: handle this case, clear nearBit?
        console.log('more than 1');
      }
    },



    onDragEnd:function( event ) {
      // dragSnapSelectedId = null;

      var x = this.endX;
      var y = this.endY;
      var nearBitRect = $(nearBit)[0].getClientRects()[0];
      var dragBitRect = $($bitElement)[0].getClientRects()[0];

      // snap to nearest bit
      // via http://greensock.com/forums/topic/9265-draggable-snapping-to-specific-points-with-sensitivity/

      // // TODO: only pick one, if multiple
      // // snap to axis depending on if above/below center line, left/r from cross line
      // // var snapMade = false;
      // for(var i = 0; i < $bits.length;i++){
      //   if(this.hitTest($bits[i], overlapThreshold)){
      //     var rect = $($bits[i])[0].getClientRects()[0];
      //     // snapMade = true;
      //     x = rect.left + rect.width;
      //     y = rect.top + rect.height;
      //   }
      // }

      // if snapping was set, get the new snap position
      if ($(nearBit).hasClass('near--top')){
        y = nearBitRect.top - dragBitRect.height;
        $('.near--top').removeClass("near--top");
      }

      else if ($(nearBit).hasClass('near--bottom')){
        y = nearBitRect.bottom + 1;
        $('.near--bottom').removeClass("near--bottom");
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
    }

  });

  return draggable;


  function showSnapGuides(nearBitElement, dragBitElement){
    var nearBitRect = nearBitElement.getClientRects()[0];
    var dragBitRect = dragBitElement.getClientRects()[0];

    // function centerPoint(rect){
    //   return { 
    //     x: parseInt((rect.left + rect.right) / 2),
    //     y: parseInt((rect.top + rect.bottom) / 2)
    //   } 
    // }


    // var resultY = _.inRange(dragBitRect.top, centerPoint(nearBitRect).y, nearBitRect.bottom);

    // if (resultY){
    //   console.log('bottom side');
    //   $(nearBitElement).removeClass("near--top near--right near--left");
    //   $(nearBitElement).addClass("near--bottom");
    // }

    // console.log('-----------');
    // console.log("nearbit: ", nearBitElement.id, " : ", nearBitRect);
    // console.log("dragBit: ", dragBitElement.id, " : ", dragBitRect);
    // console.log('-----------');


 
    function snapVertical (dragBitRect, nearBitElement){

      // snap to the bottom
      if (dragBitRect.top > (nearBitRect.bottom - snapThreshold)){
        $(nearBitElement).addClass("near--bottom");
        $(nearBitElement).removeClass("near--top");
        return parseInt(nearBitRect.bottom + 1);
      }

      else{
        $(nearBitElement).removeClass("near--bottom");
      }

      // snap to the top
      if (dragBitRect.bottom < (nearBitRect.top + snapThreshold)){
        $(nearBitElement).addClass("near--top");
        $(nearBitElement).removeClass("near--bottom");
        return parseInt(nearBitRect.top - dragBitRect.height);
      }

      else {
        $(nearBitElement).removeClass("near--top");
      }
    }
  
    var newY = snapVertical(dragBitRect, nearBitElement);
    console.log("newY: ", newY);

    // var resultX = _.inRange(dragBitRect.left, centerPoint(nearBitRect).x, nearBitRect.right);


  }


};




