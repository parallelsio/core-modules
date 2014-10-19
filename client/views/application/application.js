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
  Session.set('bitHovering', '');
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

    var bitHovering = Session.get('bitHovering');
    console.log();

    if(bitHovering)
    {
      Bits.remove(bitHovering);
      console.log("bit:delete: " + bitHovering);
    }
  });

  // bind globally, so escape is caught even inside forms
  Mousetrap.bindGlobal('esc', function() {
    event.preventDefault();
    event.stopPropagation();

    console.log('escape key');
    var bitEditing = Session.get('bitEditing');

    if (bitEditing)
    {
        Bits.remove( bitEditing );
        Session.set('bitEditing', null);
    }
  });

  Mousetrap.bind("space", function() {
    event.preventDefault();
    event.stopPropagation();

    console.log("pressed spacebar");

    var bitHoveringId = Session.get('bitHovering');
    var element = document.querySelector("[data-id='" + bitHoveringId + "']");
    var bitTemplate = Blaze.getView(element);
    var bitData = Blaze.getData(bitTemplate);

    if(element)
    {
      console.log("bit:preview: " + bitHoveringId);

      // react differently, depending on bit type
      // for image, scale it up to fill the view port
      if (bitData.type === "image"){
        
        (function scaleImageToFitWindow(){

          var timeline = new TimelineMax({ 
            onComplete: timelineDone, 
            onCompleteParams:[ element, bitData ]
          });

          var availWidth = window.screen.availWidth;
          var availHeight = window.screen.availHeight;
          var chromeHeight = availHeight - (document.documentElement.clientHeight || availHeight);

          // padding for top and bottom
          var edgePadding = 10; 

          //  room to display, after padding from edges is accounted for
          var freeHeight = document.documentElement.clientHeight - (edgePadding * 2);
          var freeWidth;
          var options;

          // use computed height of image thumbnail to decide
          if (element.clientHeight <= freeHeight) {

            // show normal image size
            // TODO: scale up to 75% maybe?
            options = { width: bitData.nativeWidth, height: bitData.nativeHeight  };

            // TODO: center viewport around the image
          }

          // shrink height of full size image to fit viewport height
          else {
            /*
                calc for the new width:

                 nativeHeight         x
                -------------  =  ----------
                 nativeWidth      freeHeight    
            */
            freeWidth = (bitData.nativeHeight * freeHeight) / bitData.nativeWidth;
            options = { width: Math.floor(freeWidth), height: freeHeight }; 
          }

          options.scale = 1;
          options.ease = Elastic.easeOut;

          timeline
            .to(element, 0.15, { scale: 0.8, ease:Quint.easeOut } )
            .to(element, 0.30, options );

          function timelineDone( node, bitTemplate ){
            console.log("bit:preview:", bitHoveringId, "tween done." );
          }

        })();
      }

      // for text, open full view
      else if (bitData.type === "text") {
        console.log("bit:preview:", bitHoveringId, " is type text. Can't preview." );
      }
    }
  });

  Mousetrap.bind("shift", function() {
    event.preventDefault();
    event.stopPropagation();
    
    console.log("pressed shift");
    var bitHovering = Session.get('bitHovering');
    var isDrawingParallel = Session.get('isDrawingParallel');

    console.log();

    if(bitHovering && (!isDrawingParallel))
    {
      // shift
      console.log("bit:ready for drag: " + bitHovering);

      // mark it as in progress
      Session.set('isDrawingParallel', true);

      // TODO: get viewport size
      // merge with zelda animation, as that uses it too
      // TODO: innerHeight/Width better?
      var screenWidth = window.screen.availWidth;
      var screenHeight = window.screen.availHeight;
      var chromeHeight = screenHeight - (document.documentElement.clientHeight || screenHeight);

      // creates transparent canvas 
      var r = Raphael(0, 0, screenWidth, chromeHeight);

      var element = document.querySelector("[data-id='" + bitHovering + "']");

      // get bit obj
      // template.data.position_x
      // template.data.position_y
      

      // TODO: only enable if none others are going

      // 

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


  