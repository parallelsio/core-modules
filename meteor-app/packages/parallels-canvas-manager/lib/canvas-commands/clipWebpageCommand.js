Meteor.startup(function () {
  InfiniteUndo.CommandRegistry.registerCommand(ParallelsCanvasManager.Canvas.prototype, {

    name: 'clipWebpage',

    event: 'bit.clipWebpage',

    execute: function (canvas, payload, onComplete) {
      var bit = _.find(canvas.bits, function (b) {
        return b._id === payload._id
      });
      payload.original = {
        _id: bit._id,
        canvasId: bit.canvasId,
        html: bit.html,
        liftStatus: bit.liftStatus
      };
      bit.html = payload.html;
      bit.liftStatus = payload.liftStatus;

      onComplete(null, {payload: payload, result: bit});
    }
  });
});
