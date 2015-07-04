Meteor.startup(function () {
  InfiniteUndo.CommandRegistry.registerCommand(ParallelsCanvasManager.Canvas.prototype, {

    name: 'updateBitPosition',

    event: 'bit.positionUpdated',

    execute: function (canvas, payload, onComplete) {
      var bit = _.find(canvas.bits, function (b) {
        return b._id === payload._id
      });
      payload.original = {
        _id: bit._id,
        canvasId: bit.canvasId,
        position: bit.position
      };
      bit.position = payload.position;

      onComplete(null, {payload: payload, result: bit});
    }
  });

});
