// use lodash instead of underscore
// https://github.com/meteor/meteor/issues/1009
_ = lodash;



Meteor.startup(function(){

  console.log("Meteor.startup start.");

  var bits = document.querySelector('.bit');

  console.log(bits);

  // var Draggabilly;
  // Draggabilly = require('draggabilly');

  define("draggabilly", function(){
    console.log("loaded draggabilly");
  });

  // define("draggabilly", [
  //   "classie", 
  //   "eventEmitter/eventEmitter", 
  //   "eventie/eventie", 
  //   "get-style-property/get-style-property", 
  //   "get-size/get-size"],

  //   function(require, exports, module) {

  //     // new draggabilly('.bit', {
  //     //   grid: [20, 20]
  //     // });
  // });
  


  // var drag = new draggabilly('.bit', {
  //   grid: [20, 20]
  // });


  Mousetrap.bind("4", function() {
    console.log("pressed 4");
  });

  console.log("Meteor.startup done.");

});



// keep track of current mouse position
// used when bit:new/create, use mouse position to create bit at that location
x = 0;
y = 0;

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

Deps.autorun(function() {
  console.log(Bits.find().count() + ' bits... updated via deps');
});



  