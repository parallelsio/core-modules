Meteor.startup(function () {
  InfiniteUndo.CommandRegistry.registerCommand(ParallelsCanvasManager.Canvas.prototype, {

    name: 'deleteBit',

    event: 'bit.deleted',

    execute: function (canvas, payload, onComplete) {
      var deletedBit;
      canvas.bits = _.reject(canvas.bits, function (b) {
        var shouldDelete = b._id === payload._id;
        if (shouldDelete) deletedBit = b;
        return shouldDelete;
      });

      if (deletedBit) {
        payload.original = deletedBit;
        onComplete(null, {payload: payload, result: deletedBit});
      } else {
        onComplete({message: "Delete failed. Bit with _id = " + payload._id + " was not found"});
      }
    },

    undo: function (canvas, payload, onComplete) {
      var bitExists = _.find(canvas.bits, function (b) {
        return b._id === payload._id;
      });

      if (!bitExists) {
        var bit = new Bit(payload);
        canvas.bits.push(bit);
        onComplete(null, {
          payload: _.extend({original: {_id: bit._id, canvasId: bit.canvasId}}, bit),
          result: bit
        });
      } else {
        onComplete({message: "Create failed. Bit with _id = " + payload._id + " already exists"});
      }
    }
  });
});
