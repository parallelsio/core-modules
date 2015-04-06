// RUNS ONLY IN CLIENT

// use lodash instead of underscore
// https://github.com/meteor/meteor/issues/1009
_ = lodash;




// TODO: refactor this out into its own namespace
var scaleImage = function(bitData, bitPreviewingId, $bit, bitTemplate, direction){

  $bitImg = $(bitTemplate.templateInstance().$('img'));

  var bitThumbnailHeight = $bitImg.height();
  var bitThumbnailWidth = $bitImg.width();

  var maskLeft         = $('.wipe.bit-preview.side-to-side .mask.left');
  var maskRight        = $('.wipe.bit-preview.side-to-side .mask.right');

  var documentWidth  = $(document).width();
  var documentHeight = $(document).height();


  var toWidth, toHeight, easeType;

  // set up and calculate the vars to be used during the animation differently, 
  // depending on if the image is to be expanded or contracted.

  // when expanding, we try to make the image use up most of the viewport space to preview
  // and save the image's thumbnail height+width in a session var
  if (direction === "expand")
  {

    // padding for top and bottom, in pixels
    var edgePadding = 10; 

    // using d.d.c faster than jQuery(window).width()
    // http://ryanve.com/lab/dimensions
    // TODO: refactor to use Verge lib. available as Meteor package?

    // calc the height available, accounting for space for image to breathe from edges
    var freeHeight = document.documentElement.clientHeight - (edgePadding * 2);
   
    // use freeHeight to determine how to preview
    // TODO: use height + width, for cases where height fits nicely 
    // in the viewport, but image is very wide, wider than viewport 
    if ((bitData.nativeHeight > bitThumbnailHeight) && 
        (bitThumbnailHeight <= freeHeight)) {

      var previewHeight = freeHeight;

      /*
          calc for the new width:

           nativeHeight       previewHeight
          -------------  =  ----------------
           nativeWidth       x (previewWidth) 
      */
      var previewWidth = Math.floor((bitData.nativeWidth * previewHeight) / bitData.nativeHeight);

      toWidth = previewWidth;
      toHeight = previewHeight;
      easeType = Expo.easeOut;

    }
  }

  // when contracting (on the way down), the animation bounces to give it a feel 
  // like gravity is at play. We use the original thumbnail height + width, 
  // as our destination height + width, saved to the session when we expanded,
  // and clear these vars when finished
  else if (direction === "contract")
  {
    toWidth = Session.get('bitThumbnailWidth');
    toHeight = Session.get('bitThumbnailHeight');
    easeType = Elastic.easeOut.config(2, 0.4)
  }
  
  var options = { 
    width: toWidth, 
    height: toHeight,
    scale: 1,
    ease: easeType
  }; 


  var timelineStart = function () {
    console.log('bit:preview timeline starting ...');

    // TODO: kill all running animations

    // disable scrolling
    $("body").css( "overflow", "hidden");

    // TODO: disable bit actions (drag, delete)

    if (direction === "expand")
    {
      Session.set('bitThumbnailHeight', bitThumbnailHeight);
      Session.set('bitThumbnailWidth', bitThumbnailWidth);
    }
  };

  var timelineDone = function( bitPreviewingId, direction ){
    
    if (direction === "expand")
    {
      Session.set('bitPreviewingId', bitPreviewingId);
    }

    else if (direction === "contract")
    {
      bitPreviewingId = "";
      Session.set('bitPreviewingId', null);
      Session.set('bitThumbnailWidth', null);
      Session.set('bitThumbnailHeight', null);
    }

    console.log("bit:preview:", bitPreviewingId, "tween done." );
  };

  var timeline = new TimelineMax({ 
    onStart: timelineStart,
    onComplete: timelineDone, 
    onCompleteParams:[ bitPreviewingId, direction ]
  });

  // run the animations.
  // the settings and sequencing is inspired by the Zelda 'wipes' 
  // https://www.youtube.com/watch?v=wHaZrYX0kAU&t=14m54s
  if (direction === "expand")
  {
    console.log("expanding...");

    timeline
      .set($('.wipe.bit-preview.side-to-side'), { alpha: 1, display: "block" })
      .fromTo(maskRight,  0.25, { x:  documentWidth / 2, ease: Expo.easeOut }, { x: 0 }, 0.12 )
      .fromTo(maskLeft,   0.25, { x: -documentWidth / 2, ease: Expo.easeOut }, { x: 0 }, 0.12 )

      // TODO: this wont be needed after on hover, bit swaps to top of 
      // z-index stack
      .set($($bit), { zIndex: 10 })

      // TODO: move/center viewport around the image

      // blow up image from thumbnail size up to fit the viewport height
      .to($bitImg, 0.10, { scale: 0.9, ease:Quint.easeOut } )
      .to($bitImg, 0.25, options );
  }

  else if (direction === "contract")
  {
    console.log("contracting...");

    timeline

      .fromTo(maskLeft, 0.25, { x: 0 }, { x: -documentWidth / 2, ease: Expo.easeOut }, 0.12 )
      .fromTo(maskRight, 0.25, { x: 0 }, { x:  documentWidth / 2, ease: Expo.easeOut }, 0.12 )

      // contract image from viewport height down to original thumbnail size 
      .to($bitImg, 0.10, { scale: 1.1, ease:Quint.easeOut } )
      .to($bitImg, 0.25, options )

      .set($($bit), { zIndex: 1 })
      .set($('.wipe.bit-preview.side-to-side'), { alpha: 0, display: "none" });
  }
};


Meteor.startup(function(){

  console.log("Meteor.startup start.");
  
    // reset any leftover session vars from last load
  Session.set('bitPreviewingId', null);
  Session.set('bitThumbnailWidth', null);
  Session.set('bitThumbnailHeight', null);

  Session.set('bitHoveringId', null);
  Session.set('bitEditingId', null);

  Session.set('isDrawingParallel', false);

  
  // TODO: why doesnt JS native selector work here
  // but Jquery does?
  // var elem = document.querySelector('.bit');
  // var elem = $('.bit');
  // console.log(elem);


  // TODO: belong here, or on map?
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
          scaleImage(bitData, bitHoveringId, $bit, bitTemplate, "expand");
        }

        else
        {
          // bit is being previewed, close/restore to thumbnail size
          scaleImage(bitData, bitHoveringId, $bit, bitTemplate, "contract");
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
      // shift
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
      // TweenLite.to(rect, 3, { raphael:{ fill:"#00f", x:100, y:100, width:100, height:50 }, ease:Power1.easeInOut});


    }
  });


  console.log("Meteor.startup done.");

  Tracker.autorun(function() {
    console.log(Bits.find().count() + ' bits... updated via deps');
  });



});



// keep track of current mouse position
// used when bit:new/create, use mouse position to create bit at that location
// x = 0;
// y = 0;

showNotifications = true;

showNotification = function(message, type) {

  // default to info. other options: success, error, notice
  if (typeof type === "undefined") {
    type = "info";
  }

  console.log(message);
  
};


  