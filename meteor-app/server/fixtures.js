Meteor.startup(function () {

  if (Bits.find().count() === 0) {

    CanvasRepo.get("1", function (err, canvas) {
      if (err) return log.error(err);
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
      ].map(canvas.createBit.bind(canvas));

      CanvasRepo.commit(canvas, {forceSnapshot: true}, function (err) {
        if (err) log.error(err);
      });
    });
  }
});
