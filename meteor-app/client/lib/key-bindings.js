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

// bind globally, so escape is caught even inside forms
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

Mousetrap.bind("shift", function() {
  event.preventDefault();
  event.stopPropagation();
  
  console.log("pressed shift");
  var bitHoveringId = Session.get('bitHoveringId');
  var isDrawingParallel = Session.get('isDrawingParallel');

  console.log();

  if(bitHoveringId && (!isDrawingParallel))
  {
    console.log("bit:ready for drag: " + bitHoveringId);

    // mark it as in progress
    Session.set('isDrawingParallel', true);

    // creates transparent canvas 
    // merge with zelda animation, as that uses it too
    var r = Raphael(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);

    var element = document.querySelector("[data-id='" + bitHoveringId + "']");

    // get bit obj
    // template.data.position_x
    // template.data.position_y
    
    // TODO: only enable if none others are going

    // var circle = r.circle(element.position.x, element.position.y, 10);
    // circle.attr({ fill: "blue" });

    // TODO: move to map? merge map.js + app.js?

    $(this).mousemove( function(event) {
      console.log("mouse event.page_: ", event.pageX, event.pageY);
    });
    
    // $(this).unbind();

    // tween the fill to blue (#00f) and x to 100, y to 100, 
    // width to 100 and height to 50 over the course of 3 seconds using an ease of Power1.easeInOut
    TweenLite.to(rect, 3, { raphael:{ fill:"#00f", x:100, y:100, width:100, height:50 }, ease:Power1.easeInOut});
  }
});