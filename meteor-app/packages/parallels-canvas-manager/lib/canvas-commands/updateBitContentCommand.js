Meteor.startup(function () {
  InfiniteUndo.CommandRegistry.registerCommand(ParallelsCanvasManager.Canvas.prototype, {

    name: 'updateBitContent',

    event: 'bit.contentUpdated',

    execute: function (canvas, payload, onComplete) {
      var bit = _.find(canvas.bits, function (b) {
        return b._id === payload._id
      });
      payload.original = {
        _id: bit._id,
        canvasId: bit.canvasId,
        content: bit.content
      };
      bit.content = payload.content;

      onComplete(null, {payload: payload, result: bit});
    }
  });
});
