Mousetrap.bind("d", function() {

  console.log("pressed d");

  var bitHoveringId = Session.get('bitHoveringId');
  console.log();

  if(bitHoveringId)
  {
    Bits.remove(bitHoveringId);
    console.log("bit:delete: " + bitHoveringId);
  }
});


Mousetrap.bindGlobal('esc', function() {
  event.preventDefault();
  event.stopPropagation();

  console.log('escape key');
  var bitEditingId = Session.get('bitEditingId');
  var bitPreviewingId = Session.get('bitPreviewingId');

  if (bitEditingId)
  {
    Bits.remove( bitEditingId );
    Session.set('bitEditingId', null);
  }

  var mode = Session.getCurrentMode();
  mode.exit();

});


Mousetrap.bind("space", function() {
  event.preventDefault();
  event.stopPropagation();

  var bitHoveringId = Session.get('bitHoveringId');
  var bitPreviewingId = Session.get('bitPreviewingId');

  if (bitHoveringId)
  {
    console.log("pressed spacebar over bit: ", bitHoveringId);

    var $bit = document.querySelector("[data-id='" + bitHoveringId + "']");
    var bitTemplate = Blaze.getView($bit);
    var bitData = Blaze.getData(bitTemplate);

    // currently, we're only supporting preview for images, so use 
    // the bit type as the determining factor, if we should expand it
    if ((bitData.type === "image") || (bitData.type === "webpage")){
      console.log("bit:image:preview: " + bitHoveringId);

      // now, let's see if it needs to be expanded, or closed:
      if (bitPreviewingId === null)
      {
        // nothing is being previewed currently, expand the image
        Transform.scaleImage(bitData, bitHoveringId, $bit, bitTemplate, "expand");
      }

      else
      {
        // bit is being previewed, close/restore to thumbnail size
        Transform.scaleImage(bitData, bitHoveringId, $bit, bitTemplate, "contract");
      }
    }

    else {
      console.log("bit:preview:", bitHoveringId, " is not an image. Do nothing." );
    }
  }

  else {
    console.log ('space key ignored, not captured for a specific bit')
  }

});

function onEscape(bitOrigin) {
  console.log('escape key, inside create parallel, exiting mode');

  // OQ: can this be passed into the function. Will it eval to the right value at runtime?
  var isCreatingParallel = Session.get('isCreatingParallel'); 

  if (isCreatingParallel)
  {
    Session.set('isCreatingParallel', null);
    Session.set('bitParallelCreateOriginId', null);

    $(".map").removeClass('mode--create-parallel'); 
    bitOrigin.removeClass('dashed-stroke');

    // stop heartbeat animation
    // how do we store reference for this? 
    
    console.log('exiting create parallel mode complete');
  }
}

Mousetrap.bind("shift", function() {
  event.preventDefault();
  event.stopPropagation();
  
  console.log("pressed Shift key.");

  var bitHoveringId = Session.get('bitHoveringId');
  var isCreatingParallel = Session.get('isCreatingParallel');

  if(bitHoveringId && (!isCreatingParallel))
  {
    var isCreatingParallel = true;
    var bitParallelCreateOriginId = bitHoveringId;
    var $bitOrigin = $(document.querySelector("[data-id='" + bitParallelCreateOriginId + "']"));

    Session.set('isCreatingParallel', isCreatingParallel);
    Session.set('bitParallelCreateOriginId', bitParallelCreateOriginId);

    console.log("ready for creating parallel. starting at bit: " + bitParallelCreateOriginId);

    Mousetrap.bind('esc', onEscape.bind(null, $bitOrigin));

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
    

    var timelineStart = function () {
      console.log('bit:parallel:create. Origin bit' + bitParallelCreateOriginId + ': selected-loop animation starting ...');
    };

    var timelineDone = function( bitOriginId ){
      console.log('bit:parallel:create. End mode, origin bit' + bitParallelCreateOriginId + ': selected-loop animation ending.');
          
      Session.set('isDrawingParallel', null);
      Session.set('bitParallelCreateOriginId', null);

      // $(this).unbind();

      Mousetrap.unbind('esc');
    };

    var timeline = new TimelineMax({ 
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
    //   console.log("mouse event.page_: ", event.pageX, event.pageY);
    // });
    
  }
});