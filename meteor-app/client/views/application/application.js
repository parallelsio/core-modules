// RUNS ONLY IN CLIENT

// use lodash instead of underscore
// https://github.com/meteor/meteor/issues/1009
_ = lodash;


Meteor.startup(function(){


  // TODO: move to another file
  var utility = ({

    // create utility
    // var element = document.querySelector("[data-id='" + this.data._id + "']");
    // var getParallelsID = ""

    // TODO: fix to display properly
    getSessionVars: function(toPrint){
      var map = [];
      console.log('********* SESSION VARS ***********');
      for (var prop in Session.keys) {
        map.push({ key: prop, value: Session.get(prop) });
        if (toPrint) {
          console.log("session." + prop, ":", Session.get(prop));
        }
      }
      console.log('************************');

      return map;
    }
  });


  console.log("Meteor.startup start.");

    // reset any leftover session vars from last load
  Session.set('bitPreviewingId', null);
  Session.set('bitEditingId', null);
  Session.set('isDrawingParallel', false);


  utility.getSessionVars(true);

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
      window.PARALLELS.Events.publish('ux', {message: "bit:delete: " + bitHoveringId});
    }
  });

  // bind globally, so escape is caught even inside forms
  Mousetrap.bindGlobal('esc', function() {
    event.preventDefault();
    event.stopPropagation();

    console.log('escape key');
    var bitEditingId = Session.get('bitEditingId');

    if (bitEditingId)
    {
        Bits.remove( bitEditingId );
        Session.set('bitEditingId', null);
    }
  });

  Mousetrap.bind("space", function() {
    event.preventDefault();
    event.stopPropagation();
    console.log("pressed spacebar");

    var bitHoveringId = Session.get('bitHoveringId');
    var bitPreviewingId = Session.get('bitPreviewingId');

    if (bitPreviewingId)
    {
      console.log('already previewing bit:', bitPreviewingId);
    }

    else if(bitHoveringId)
    {
      Session.set('bitPreviewingId', bitHoveringId);

      var $bit = document.querySelector("[data-id='" + bitHoveringId + "']");
      var bitTemplate = Blaze.getView($bit);
      var bitData = Blaze.getData(bitTemplate);

      if (bitData.type === "image"){
        console.log("bit:image:preview: " + bitHoveringId);

        $bitImg = $(bitTemplate.templateInstance().$('img'));
        var bitThumbnailHeight = $bitImg.height();
        var bitThumbnailWidth  = $bitImg.width();

        (function scaleImageToFitWindow(){

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

            var options = {
              width: previewWidth,
              height: previewHeight,
              scale: 1,
              ease: Expo.easeOut
            };

            var maskLeft         = $('.wipe.bit-preview.side-to-side .mask.left');
            var maskRight        = $('.wipe.bit-preview.side-to-side .mask.right');

            var documentWidth  = $(document).width();
            var documentHeight = $(document).height();

            var timelineStart = function () {
                console.log('bit:preview timeline starting ...');

                // TODO: kill all running animations

                // disable scrolling
                $("body").css( "overflow", "hidden");

                // disable bit actions (drag)
            };

            var timeline = new TimelineMax({
              onStart: timelineStart,
              onComplete: timelineDone,
              onCompleteParams:[ bitHoveringId ]
            });

            timeline

              // zelda wipe in of overlay bg
              // inspired by: https://www.youtube.com/watch?v=wHaZrYX0kAU&t=14m54s
              .set($('.wipe.bit-preview.side-to-side'), { alpha: 1, display: "block" })
              .fromTo(maskRight,  0.25, { x:  documentWidth / 2, ease: Expo.easeOut }, { x: 0 }, 0.12 )
              .fromTo(maskLeft,   0.25, { x: -documentWidth / 2, ease: Expo.easeOut }, { x: 0 }, 0.12 )

              // TODO: this wont be needed after on hover, bit swaps to top of
              // z-index stack
              .set($($bit), { zIndex: 10 })

              // TODO: move/center viewport around the image

              // blow up image from thumbnail size up to fit the viewport height
              // TODO: overlap with zelda swipe in
              .to($bitImg, 0.10, { scale: 0.9, ease:Quint.easeOut } )
              .to($bitImg, 0.25, options );

            var timelineDone = function( bitHoveringId ){
              console.log("bit:preview:", bitHoveringId, "tween done." );

              // TODO:  wire up escape here to close?
              // inside of close function, make sure to set Session.set('bitPreviewingId', null);
            };


          }
        })();
      }

      else if (bitData.type === "text") {
        // TODO: how to preview text?
        console.log("bit:preview:", bitHoveringId, " is type text. Feature not built yet." );
      }
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


