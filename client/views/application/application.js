// RUNS ONLY IN CLIENT

// use lodash instead of underscore
// https://github.com/meteor/meteor/issues/1009
_ = lodash;



Meteor.startup(function(){

  console.log("Meteor.startup start.");
  
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


  Mousetrap.bind("space", function() {
    event.preventDefault();
    event.stopPropagation();
    
    console.log("pressed spacebar");
    var bitHovering = Session.get('bitHovering');
    console.log();

    if(bitHovering)
    {
      // preview
      console.log("bit:preview: " + bitHovering);
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


  