var root;


Meteor.startup(function() {

  var bits, drag;
  
  console.log("startup");
  bits = document.querySelector('.bit');

	var Draggabilly;
	Draggabilly = require('draggabilly');

  /*
  define("draggabilly", [
  	"classie/classie", 
  	"eventEmitter/eventEmitter", 
  	"eventie/eventie", 
  	"get-style-property/get-style-property", 
  	"get-size/get-size"],

  	function(require, exports, module) {

  		new draggabilly('.bit', {
  			grid: [20, 20]
  		});
	});
	*/


  drag = new draggabilly('.bit', {
    grid: [20, 20]
  });

  console.log("ready!");

  Mousetrap.bind("4", function() {
  	console.log("pressed 4");
	});


});



/*************************************************************************/
root = typeof global !== "undefined" && global !== null ? global : window;
/*************************************************************************/

// keep track of current mouse position
// used when bit:new/create, use mouse position to create bit at that location
root.x = 0;
root.y = 0;

root.showNotifications = true;

root.showNotification = function(message, type) {

	// default to info. other options: success, error, notice
  if (typeof type === "undefined") {
    type = "info";
  }
  if (root.showNotifications) {
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
  console.log(Bits.find().count() + ' bits. deps');
});



	