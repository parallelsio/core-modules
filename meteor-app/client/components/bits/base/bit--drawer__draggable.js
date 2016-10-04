// Unlike dragging + dropping when on a canvas/map/set,
// bits displayed in the drawer will have no Transform set,
// and be positioned using Flexbox layout grid

// Drag + drop in this context is only to allow person to select
// which set they want to add it to. Inspired by:
 // http://tympanus.net/Development/DragDropInteractions/modal.html

// The set modal will slide in under the bit, once it has been "picked up" by the drag.
// To get this to work, we'll need some clever element cloning, adapted from: 
// https://codepen.io/lifeinchords/pen/QKOKyk?editors=1010

// The comments in that pen describe the technique well

// Also, any snapping code has been removed, as it's not relevant here

/* ///////////////////////////////////////////////////////////////////////////////////
// DRAGGING AN ELEMENT OUTSIDE A SCROLLABLE CONTAINER
///////////////////////////////////////////////////////////////////////////////////

HOW IT WORKS...

The app starts off by creating clones for each tile using the scope listed below.
When the user clicks on a tile, startDraggable is called, which enables the 
draggable instance to be dragged. When this happens, the real tile is hidden, 
with the clone taking its place. Because the clone is not actually inside the 
overflow container, it can be dragged anywhere. When the dragging stops, the clone
goes back to a hidden state.

SCOPE
- element: the tile element located in the #scroll-box
- wrapper: the element's parent, used to animate the space collapsing around a tile
- clone: a clone of the element that gets appended to the #clone-container
- dropped: is true when the tile is appended to the #drop-panel
- moved: is true when the tile has been dragged outside of its wrapper
- draggable: the draggable instance used by the clone
- x,y: getters that return the start position of the element 
- width: the width of the wrapper

START DRAGGABLE 
- moves the clone to the tile's position
- toggles the visibility between the element and clone
- starts the draggable instance by passing in the pointer event to its startDrag method

ON DRAG
- checks if the clone is outside of the wrapper using hitTest
- if true, it animates the space collapsing where the tile used to be

ON RELEASE
- checks if the clone is inside the drop panel using hitTest
- if it's inside and not already dropped, the wrapper is appended to the panel

MOVE BACK
- animates the wrapper space expanding
- animates the clone moving back to its starting position
- toggles the visibility between the clone and tile

///////////////////////////////////////////////////////////////////////////////////
*/


import _ from 'lodash';

// Draggable.zIndex = 5;

// terrible, terrible code.
// TODO: merge into one function. Reuse speed of animation, ease type, scale value
// Inspired by: http://tympanus.net/Development/DragDropInteractions/modal.html
function showSetPicker($bitElement){
  var $modalContainer = $(".modal--set-container");
  var $modalSets = $(".modal__sets");

  $("body").removeClass('u--scroll--vertical-only');
  $("body").addClass('u--scroll--none');

  // TweenMax.fromTo(
  //   $modalContainer,
  //   0.25,
  //   {
  //     scale: 1.1
  //   },
  //   { 
  //     scale: 1,
  //     autoAlpha: 1,
  //     ease: Circ.easeOut
  //   }
  // )

  // allow bit to be dragged over the drop area, to indicate which set to add it to
  $bitElement.zIndex = $modalContainer.zIndex() + 1;
  $modalContainer.css("pointer-events", "all" );
  $modalSets.css("pointer-events", "all");
}

function hideSetPicker(){
  $("body").addClass('u--scroll--vertical-only');
  $("body").removeClass('u--scroll--none');

  TweenMax.to(
    ".modal--set-container",
    0.25,
    { 
      scale: 1.1,
      autoAlpha: 0,
      ease: Circ.easeOut
    }
  )
}



makeDrawerBitDraggable = function makeDrawerBitDraggable($bitElement, $dragHandle){

  var timeline = new TimelineMax();
  var $bits = $(".drawer .bit");
  var overlapThreshold = "0%"; 
  var nearBitElement;
  var snapThreshold = 60; // in pixels

  console.log ('wiring drawer bit for drag: ', $bitElement);

  // Needs to happen after position set, or else positions
  // via manual transforms get overwritten by Draggable
  // http://greensock.com/docs/#/HTML5/GSAP/Utils/Draggable
  var draggable = Draggable.create($bitElement, {
    trigger: $dragHandle,
    throwProps: false,
    zIndexBoost: true,
    autoScroll: 1,
    cursor: "inherit",

    // bounds:,
    // edgeResistance:0.65,
    // type:"x,y", // default?

    onPress: function(event){
    
      Parallels.Keys.unbindActions();
      Parallels.Keys.bindSnapToggle();
      // Parallels.Keys.bindCatchSpace();

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
        .to($bitElement.find('.bit__drag-handle'), 0.1, { scale: 1.5, autoAlpha: "0.1", ease: Expo.easeOut }), "-=0.10";

        $bitElement.addClass('dragging');
      
      showSetPicker($bitElement);
    },

    onRelease: function(event){
      // Parallels.Keys.unbindSnapToggle();
      // Parallels.Keys.unbindCatchSpace();
      Parallels.Keys.bindActions();

      timeline
        .to($bitElement, 0.1, { scale: 1, boxShadow: "0", ease: Expo.easeOut })
        .to($bitElement.find('.bit__drag-handle'), 0.1, { scale: 1, autoAlpha: "1", ease: Expo.easeOut }), "-=0.10";
   
      $bitElement.removeClass('dragging');

    },

    onDragStart:function(event){

      Parallels.log.debug(event.type, " : dragStart: ", this.getDirection("start"), " : ");
      Parallels.Audio.player.play('fx-cinq-drop');
    },

    onDrag: function(e) {
      var dragBitRect = $($bitElement)[0].getClientRects()[0];
      // console.log(dragBitRect);

      // if (Session.equals('isSnapEnabled', true)){

      //   // loop through all bits, and run a hit test on each one against dragging bit
      //   // TODO: restrict search to only what's visible in viewport, via Verge?
      //   var nearBitCount = 0;
      //   for(var i = 0; i < $bits.length; i++){
      
      //     if (this.hitTest($bits[i], overlapThreshold))  {
      //       nearBitElement = $bits[i];
      //       nearBitCount = nearBitCount + 1;
      //       showSnapGuides();
      //     }
      //   }

      //   if (nearBitCount === 0){
      //     nearBitElement = null;
      //     clearAllGuides();
      //   }

      //   else if (nearBitCount > 1) {
      //     // TODO: handle this case, clear nearBit?
      //     console.log('more than 1 bit to snap: not sure which to pick');
      //     clearAllGuides();
      //   }
      // } 
    },


    onDragEnd:function( event ) {
      var x = this.endX;
      var y = this.endY;

      // if (nearBitElement) {
      //   var nearBitRect = $(nearBitElement)[0].getClientRects()[0];
      // }
      // var dragBitRect = $bitElement[0].getClientRects()[0];

      // snap to nearest bit
      // via http://greensock.com/forums/topic/9265-draggable-snapping-to-specific-points-with-sensitivity/

      hideSetPicker();

      // TODO: save bit into selected set here. 
      // Where do we insert it in the set canvas? how do we indicate it's new?       


      // if (Session.equals('isSnapEnabled', true)){

      //   // if snapping was set, get the new snap position
      //   if ($(nearBitElement).hasClass('near--top')){
      //     y = (nearBitRect.top - dragBitRect.height) + verge.scrollY();
      //     $(nearBitElement).removeClass("near--top");
      //   }

      //   else if ($(nearBitElement).hasClass('near--bottom')){
      //     y = (nearBitRect.bottom) + verge.scrollY();
      //     $(nearBitElement).removeClass("near--bottom");
      //   }
      // }

      TweenLite.to($bitElement, 0.1, { x: parseInt(x), y: parseInt(y), ease: Circ.easeOut });

      // var mongoId = this.target.dataset.id;

      // // save new position to db
      // Meteor.call('changeState', {
      //   command: 'updateBitPosition',
      //   data: {
      //     canvasId: Session.get('canvasId'),
      //     _id: mongoId,
      //     position: { x: x, y: y }
      //   }
      // });

      // a random tone from the series, in the mid-range of the scale
      // Parallels.Audio.player.play('tone--aalto-dubtechno-mod-' + _.random(4, 8));

      // animate out dragging shadow, and play snap sound if snap was toggled on
     // if (Session.equals('isSnapEnabled', true)){
     //    Parallels.Audio.player.play("sdrums--placeholder--0008_bongo_01_high");
     //    Parallels.Audio.player.play("sdrums--placeholder--0041_perc_11_1");
     //    Parallels.Audio.player.play("fx-ping-2x");

     //    Parallels.log.debug("bit:snap" );
     //  }

      // animate out dragging shadow
      timeline
        .to($bitElement, 0.1, { scale: 1, boxShadow: "0", ease: Expo.easeOut })
        .to($bitElement.find('.bit__drag-handle'), 0.05, { scale: 1, autoAlpha: "1", ease: Expo.easeOut })

      $bitElement.removeClass('dragging');
      // nearBitElement = null;
      // clearAllGuides();
      // Session.set('isSnapEnabled', false);
    }

  });

  return draggable;

  // function clearAllGuides(){
  //   $(".near--bottom").removeClass("near--bottom");
  //   $(".near--top").removeClass("near--top");
  //   $(".near--left").removeClass("near--left");
  //   $(".near--right").removeClass("near--right");
  // }

  // function showSnapGuides(){
  //   var nearBitRect = $(nearBitElement)[0].getClientRects()[0];
  //   var dragBitRect = $bitElement[0].getClientRects()[0];

  //   // console.log('-----------');
  //   // console.log("nearbit: ", nearBitElement.id, " : ", nearBitRect);
  //   // console.log("dragBit: ", $bitElement.id, " : ", dragBitRect);
  //   // console.log('-----------');

  //   // show bottom snap guide
  //   if (dragBitRect.top > (nearBitRect.bottom - snapThreshold)){
  //     $(nearBitElement).addClass("near--bottom");
  //     $(nearBitElement).removeClass("near--top");
  //   }

  //   // show top snap guide
  //   if (dragBitRect.bottom < (nearBitRect.top + snapThreshold)){
  //     $(nearBitElement).addClass("near--top");
  //     $(nearBitElement).removeClass("near--bottom");
  //   }
  // }


};




