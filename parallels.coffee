// if (Meteor.isClient) {
//   Template.hello.greeting = function () {
//     return "Welcome to meteor-parallels.";
//   };

//   Template.hello.events({
//     'click input' : function () {
//       // template data, if any, is available in 'this'
//       if (typeof console !== 'undefined')
//         console.log("You pressed the button");
//     }
//   });
// }

// if (Meteor.isServer) {
//   Meteor.startup(function () {
//     // code to run on server at startup
//   });
// }


# both client + server
Bits = new Meteor.Collection("bits")


if Meteor.isClient
  Template.map.bits = -> Bits.find()

