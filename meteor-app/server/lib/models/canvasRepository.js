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

          // todo: duplication here because we have to set event listeners on canvas which is not a global prop. Can we do better?
          canvas.on('bit.created', function (bit) {
            StateChangeEvents.emit('canvas.bit.created', {data: {bit: bit}});
          });

          canvas.on('bit.positionUpdated', function (bit) {
            StateChangeEvents.emit('canvas.bit.positionUpdated', {data: {bit: bit}});
          });

          canvas.on('bit.contentUpdated', function (bit) {
            StateChangeEvents.emit('canvas.bit.contentUpdated', {data: {bit: bit}});
          });

          canvas.on('bit.uploadImage', function (bit) {
            StateChangeEvents.emit('canvas.bit.uploadImage', {data: {bit: bit}});
          });

          canvas.on('bit.deleted', function (bit) {
            StateChangeEvents.emit('canvas.bit.deleted', {data: {bit: bit}});
          });

          canvas.on('bit.clipWebpage', function (bit) {
            StateChangeEvents.emit('canvas.bit.clipWebpage', {data: {bit: bit}});
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
