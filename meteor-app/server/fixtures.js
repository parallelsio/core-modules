Meteor.startup(function () {
  if (Bits.find().count() === 0) {
    [
      {
        type: "text",
        position: {
          x: 450,
          y: 400
        },
        content: "Hello world!",
        color: "white"
      }
    ].map(function (data) {
        Meteor.call('insertBit', data);
      });
  }
});
