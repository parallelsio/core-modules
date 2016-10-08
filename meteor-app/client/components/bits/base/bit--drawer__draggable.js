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





makeDrawerBitDraggable = function makeDrawerBitDraggable($bitElement, $dragHandle){

  var timeline = new TimelineMax();
  var $drawerBits = $(".drawer .bit");
  var overlapThreshold = "0%"; 
  var nearBitElement;
  var snapThreshold = 60; // in pixels

  // console.log ('wiring drawer bit for drag: ', $bitElement);

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

      $bitElement.addClass('dragging');
      $bitElement.toggleClass('near');

      // allow bit to be dragged over the drop area, to indicate which set to add it to
      $bitElement.zIndex = $modalContainer.zIndex() + 1;
      $modalContainer.css("pointer-events", "all" );
      $modalSets.css("pointer-events", "all");
    },

    onRelease: function(event){
      // Parallels.Keys.unbindSnapToggle();
      // Parallels.Keys.unbindCatchSpace();
      Parallels.Keys.bindActions();
      $bitElement.removeClass('dragging');
      $drawerBits.removeClass('near');
    },

    onDragStart:function(event){

      Parallels.log.debug(event.type, " : dragStart: ", this.getDirection("start"), " : ");
      Parallels.Audio.player.play('fx-cinq-drop');

      // if more than 1 is selected, collect into a stack




      ///////////// SHOW SET MODAL, WIRE EVENTS FOR PICKER
      // TODO: merge into show/hide into one toggle function. Reuse speed of animation, ease type, scale value
      // Inspired by: http://tympanus.net/Development/DragDropInteractions/modal.html
      var $modalContainer = $(".modal--set-container");
      var $modalSets = $(".modal__sets");

      $("body").addClass('u--scroll--vertical-only');
      $("body").removeClass('u--scroll--none');

      TweenMax.set($modalContainer, 
      { 
        x: verge.scrollX(),
        y: verge.scrollY()
      });

      TweenMax.fromTo(
        $modalContainer,
        0.25,
        {
          scale: 1.1
        },
        { 
          scale: 1,
          autoAlpha: 1,
          ease: Circ.easeOut
        }
      )

    },

    onDrag: function(e) {
      var dragBitRect = $($bitElement)[0].getClientRects()[0];
      // console.log(dragBitRect);

      // if (Session.equals('isSnapEnabled', true)){

      //   // loop through all bits, and run a hit test on each one against dragging bit
      //   // TODO: restrict search to only what's visible in viewport, via Verge?
      //   var nearBitCount = 0;
      //   for(var i = 0; i < $drawerBits.length; i++){
      
      //     if (this.hitTest($drawerBits[i], overlapThreshold))  {
      //       nearBitElement = $drawerBits[i];
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

      $("body").removeClass('u--scroll--vertical-only');
      $("body").addClass('u--scroll--none');

      $drawerBits.removeClass('near');
      
      TweenMax.to(
        ".modal--set-container",
        0.25,
        { 
          scale: 1.1,
          autoAlpha: 0,
          ease: Circ.easeOut
        }
      )


      TweenLite.to($bitElement, 0.1, { x: parseInt(x), y: parseInt(y), ease: Circ.easeOut });

    

      // a random tone from the series, in the mid-range of the scale
      // Parallels.Audio.player.play('tone--aalto-dubtechno-mod-' + _.random(4, 8));

      // animate out dragging shadow, and play snap sound if snap was toggled on
     // if (Session.equals('isSnapEnabled', true)){
     //    Parallels.Audio.player.play("sdrums--placeholder--0008_bongo_01_high");
     //    Parallels.Audio.player.play("sdrums--placeholder--0041_perc_11_1");
     //    Parallels.Audio.player.play("fx-ping-2x");

     //    Parallels.log.debug("bit:snap" );
     //  }

      $bitElement.removeClass('dragging');

    }

  });

  return draggable;


};




