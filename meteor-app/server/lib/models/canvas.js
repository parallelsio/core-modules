var util = Npm.require('util');
var Entity = Meteor.npmRequire('sourced').Entity;

Canvas = function Canvas (snapshot, events) {
  var self = this;
  self.id = null; // unique identifier for this canvas
  self.bits = []; // collection of bits on this canvas
  Entity.call(self, snapshot, events);
};
util.inherits(Canvas, Entity);

_.extend(Canvas.prototype, {
  initialize: function (id, cb) {
    this.id = id;
    if(cb) cb();
  },
  createBit: function (payload, cb) {
    var bit = new Bit(payload);
    this.digest('createBit', bit); // record that the createBit event was called
    this.bits.push(bit);

    this.enqueue('bit.created', bit); // enqueues an event that will trigger once the canvas transaction has been committed.

    if(cb) cb(null, bit);
  },
  deleteBit: function (payload, cb) {
    this.digest('deleteBit', payload);
    this.bits = _.reject(this.bits, function (b) { return b._id === payload._id });

    this.enqueue('bit.deleted', payload);

    if(cb) cb();
  },
  updateBitPosition: function (payload, cb) {
    this.digest('updateBitPosition', payload);

    var bit = _.find(this.bits, function (b) { return b._id === payload._id });
    if (payload.position) {
      bit.position = payload.position;
      this.enqueue('bit.positionUpdated', bit);
    }

    if(cb) cb();
  },
  updateBitContent: function (payload, cb) {
    this.digest('updateBitContent', payload);

    var bit = _.find(this.bits, function (b) { return b._id === payload._id });
    if (payload.content) {
      bit.content = payload.content;
      this.enqueue('bit.contentUpdated', bit);
    }

    if(cb) cb();
  },
  uploadImage: function (payload, cb) {
    this.digest('uploadImage', payload);

    var bit = _.find(this.bits, function (b) { return b._id === payload._id });
    if (payload.imageSource) {
      bit.imageSource = payload.imageSource;
      bit.uploadKey = payload.uploadKey;
      this.enqueue('bit.uploadImage', bit);
    }

    if(cb) cb();
  },
  clipWebpage: function (payload, cb) {
    this.digest('clipWebpage', payload);

    var bit = _.find(this.bits, function (b) { return b._id === payload._id });
    if (payload.html) {
      bit.html = payload.html;
      bit.liftStatus = payload.liftStatus;
      this.enqueue('bit.clipWebpage', bit);
    }

    if(cb) cb();
  }

});
