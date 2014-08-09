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

  Mousetrap.bind("4", function() {
    console.log("pressed 4");
  });

  console.log("Meteor.startup done.");

  Deps.autorun(function() {
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
  if (showNotifications) {
    $.pnotify({
      text: message,
      shadow: false,
      animation: 'fade',
      type: type,
      delay: 1500
    });
  }
  console.log(message);
};


  