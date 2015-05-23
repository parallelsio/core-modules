var util = Npm.require('util');
var MongoRepository = Meteor.npmRequire('sourced-repo-mongo').Repository;

// A CanvasRepository is responsible for holding and saving the state of an entire canvas including all of it's bits.
// It caches the state of the canvas in memory for quick management, and automatically saves to a mongo collection
// every 10th state change. (number of state changes between saves is configurable)
CanvasRepository = function CanvasRepository () {
  var self = this;
  self.cache = {};  // in memory version of our canvas
  MongoRepository.call(this, Canvas);
};
util.inherits(CanvasRepository, MongoRepository);

_.extend(CanvasRepository.prototype, {
  // Retrieves a Canvas by "ID", stores it in memory and replay's all known actions from the last state change to the in memory
  // version of our canvas. Then, it adds event handlers to notify the global event stream when changes to our canvas happen.
  get: function (id, cb) {
    var self = this;
    var getCanvas = Meteor.wrapAsync(function (callback) {
      var canvas = self.cache[id];

      if (!canvas) {
        CanvasRepository.super_.prototype.get.call(self, id, function (err, canvas) {
          self.cache[id] = canvas;

          canvas.on('bit.created', function (bit) {
            StateChangeEvents.emit('canvas.bit.created', {data: {bit: bit, canvas: _.pick(canvas, 'id', 'version', 'timestamp')}});
          });

          canvas.on('bit.undo_created', function (bit) {
            StateChangeEvents.emit('canvas.bit.undo_created', {data: {bit: bit, canvas: _.pick(canvas, 'id', 'version', 'timestamp')}});
          });

          canvas.on('bit.redo_created', function (bit) {
            StateChangeEvents.emit('canvas.bit.redo_created', {data: {bit: bit, canvas: _.pick(canvas, 'id', 'version', 'timestamp')}});
          });

          canvas.on('bit.positionUpdated', function (bit) {
            StateChangeEvents.emit('canvas.bit.positionUpdated', {data: {bit: bit, canvas: _.pick(canvas, 'id', 'version', 'timestamp')}});
          });

          canvas.on('bit.undo_positionUpdated', function (bit) {
            StateChangeEvents.emit('canvas.bit.undo_positionUpdated', {data: {bit: bit, canvas: _.pick(canvas, 'id', 'version', 'timestamp')}});
          });

          canvas.on('bit.redo_positionUpdated', function (bit) {
            StateChangeEvents.emit('canvas.bit.redo_positionUpdated', {data: {bit: bit, canvas: _.pick(canvas, 'id', 'version', 'timestamp')}});
          });

          canvas.on('bit.contentUpdated', function (bit) {
            StateChangeEvents.emit('canvas.bit.contentUpdated', {data: {bit: bit, canvas: _.pick(canvas, 'id', 'version', 'timestamp')}});
          });

          canvas.on('bit.undo_contentUpdated', function (bit) {
            StateChangeEvents.emit('canvas.bit.undo_contentUpdated', {data: {bit: bit, canvas: _.pick(canvas, 'id', 'version', 'timestamp')}});
          });

          canvas.on('bit.redo_contentUpdated', function (bit) {
            StateChangeEvents.emit('canvas.bit.redo_contentUpdated', {data: {bit: bit, canvas: _.pick(canvas, 'id', 'version', 'timestamp')}});
          });

          canvas.on('bit.uploadImage', function (bit) {
            StateChangeEvents.emit('canvas.bit.uploadImage', {data: {bit: bit, canvas: _.pick(canvas, 'id', 'version', 'timestamp')}});
          });

          canvas.on('bit.undo_uploadImage', function (bit) {
            StateChangeEvents.emit('canvas.bit.undo_uploadImage', {data: {bit: bit, canvas: _.pick(canvas, 'id', 'version', 'timestamp')}});
          });

          canvas.on('bit.redo_uploadImage', function (bit) {
            StateChangeEvents.emit('canvas.bit.redo_uploadImage', {data: {bit: bit, canvas: _.pick(canvas, 'id', 'version', 'timestamp')}});
          });

          canvas.on('bit.deleted', function (bit) {
            StateChangeEvents.emit('canvas.bit.deleted', {data: {bit: bit, canvas: _.pick(canvas, 'id', 'version', 'timestamp')}});
          });

          canvas.on('bit.undo_deleted', function (bit) {
            StateChangeEvents.emit('canvas.bit.undo_deleted', {data: {bit: bit, canvas: _.pick(canvas, 'id', 'version', 'timestamp')}});
          });

          canvas.on('bit.redo_deleted', function (bit) {
            StateChangeEvents.emit('canvas.bit.redo_deleted', {data: {bit: bit, canvas: _.pick(canvas, 'id', 'version', 'timestamp')}});
          });

          canvas.on('bit.clipWebpage', function (bit) {
            StateChangeEvents.emit('canvas.bit.clipWebpage', {data: {bit: bit, canvas: _.pick(canvas, 'id', 'version', 'timestamp')}});
          });

          canvas.on('bit.undo_clipWebpage', function (bit) {
            StateChangeEvents.emit('canvas.bit.undo_clipWebpage', {data: {bit: bit, canvas: _.pick(canvas, 'id', 'version', 'timestamp')}});
          });

          canvas.on('bit.redo_clipWebpage', function (bit) {
            StateChangeEvents.emit('canvas.bit.redo_clipWebpage', {data: {bit: bit, canvas: _.pick(canvas, 'id', 'version', 'timestamp')}});
          });

          callback(null, canvas);
        });
      } else {
        callback(null, canvas);
      }
    });

    var canvas = getCanvas();

    cb(null, canvas);
  }
});
