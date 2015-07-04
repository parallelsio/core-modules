Meteor.startup(function () {
  InfiniteUndo.CommandRegistry.registerCommand(ParallelsCanvasManager.Canvas.prototype, {

    name: 'uploadImage',

    event: 'bit.uploadImage',

    execute: function (canvas, payload, onComplete) {
      var bit = _.find(canvas.bits, function (b) {
        return b._id === payload._id
      });
      payload.original = {
        _id: bit._id,
        canvasId: bit.canvasId,
        imageSource: bit.imageSource,
        uploadKey: bit.uploadKey
      };
      bit.imageSource = payload.imageSource;
      bit.uploadKey = payload.uploadKey;

      onComplete(null, {payload: payload, result: bit});
    }
  });
});
