Meteor.startup(function () {

  if (Bits.find().count() === 0) {
    [
      {
        type: "text",
        position: {
          x: 250,
          y: 200
        },
        content: "Hello world!",
        color: "white"
      }
    ].map(function (data) {
        Meteor.call('createBit', data);
      });
  }
});
