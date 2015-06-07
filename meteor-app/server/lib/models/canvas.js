var util = Npm.require('util');
var Entity = Meteor.npmRequire('sourced').Entity;

Canvas = function Canvas (snapshot, events) {
  var self = this;
  self.id = null; // unique identifier for this canvas
  self.bits = []; // collection of bits on this canvas
  Entity.call(self, snapshot, events);
};
util.inherits(Canvas, Entity);

// todo: refactor this large class into sub-module "commands". Each command should live in a "canvas-commands" directory.
_.extend(Canvas.prototype, {
  initialize: function (id, cb) {
    this.id = id;
    if(cb) cb();
  },

  _createBit: function (digestEvent, streamEvent, payload, cb) {
    var bitExists = _.find(this.bits, {_id: payload._id});
    if (!bitExists) {
      var bit = new Bit(payload);
      this.digest(digestEvent, _.extend({original: {_id: bit._id, canvasId: bit.canvasId}}, bit));
      this.bits.push(bit);
      this.enqueue(streamEvent, bit); // enqueues an event that will trigger once the canvas transaction has been committed.
    }

    if (cb) cb(null, bit);
  },

  _deleteBit: function (digestEvent, streamEvent, payload, cb) {
    var deletedBit;
    this.bits = _.reject(this.bits, function (b) {
      var shouldDelete = b._id === payload._id;
      if (shouldDelete) deletedBit = b;
      return shouldDelete;
    });

    if (deletedBit) {
      payload.original = deletedBit;
      this.digest(digestEvent, payload);
      this.enqueue(streamEvent, payload);
    }

    if (cb) cb();
  },

  _updateBitPosition: function (digestEvent, streamEvent, payload, cb) {
    var bit = _.find(this.bits, function (b) {
      return b._id === payload._id
    });
    payload.original = {
      _id: bit._id,
      canvasId: bit.canvasId,
      position: bit.position
    };
    this.digest(digestEvent, payload);
    bit.position = payload.position;
    this.enqueue(streamEvent, bit);

    if (cb) cb();
  },

  _updateBitContent: function (digestEvent, streamEvent, payload, cb) {
    var bit = _.find(this.bits, function (b) {
      return b._id === payload._id
    });
    payload.original = {
      _id: bit._id,
      canvasId: bit.canvasId,
      content: bit.content
    };
    this.digest(digestEvent, payload);
    bit.content = payload.content;
    this.enqueue(streamEvent, bit);

    if (cb) cb();
  },

  _uploadImage: function (digestEvent, streamEvent, payload, cb) {
    var bit = _.find(this.bits, function (b) {
      return b._id === payload._id
    });
    payload.original = {
      _id: bit._id,
      canvasId: bit.canvasId,
      imageSource: bit.imageSource,
      uploadKey: bit.uploadKey
    };
    this.digest(digestEvent, payload);
    bit.imageSource = payload.imageSource;
    bit.uploadKey = payload.uploadKey;
    this.enqueue(streamEvent, bit);

    if (cb) cb();
  },

  _clipWebpage: function (digestEvent, streamEvent, payload, cb) {
    var bit = _.find(this.bits, function (b) {
      return b._id === payload._id
    });
    payload.original = {
      _id: bit._id,
      canvasId: bit.canvasId,
      html: bit.html,
      liftStatus: bit.liftStatus
    };
    this.digest(digestEvent, payload);
    bit.html = payload.html;
    bit.liftStatus = payload.liftStatus;
    this.enqueue(streamEvent, bit);

    if (cb) cb();
  },

  createBit: function (payload, cb) {
    this._createBit('createBit', 'bit.created', payload, cb);
  },

  undo_createBit: function (payload, cb) {
    this._deleteBit('undo_createBit', 'bit.undo_created', payload, cb);
  },

  redo_createBit: function (payload, cb) {
    this._createBit('redo_createBit', 'bit.redo_created', payload, cb);
  },

  deleteBit: function (payload, cb) {
    this._deleteBit('deleteBit', 'bit.deleted', payload, cb);
  },

  undo_deleteBit: function (payload, cb) {
    this._createBit('undo_deleteBit', 'bit.undo_deleted', payload, cb);
  },

  redo_deleteBit: function (payload, cb) {
    this._deleteBit('redo_deleteBit', 'bit.redo_deleted', payload, cb);
  },

  updateBitPosition: function (payload, cb) {
    this._updateBitPosition('updateBitPosition', 'bit.positionUpdated', payload, cb);
  },

  undo_updateBitPosition: function (payload, cb) {
    this._updateBitPosition('undo_updateBitPosition', 'bit.undo_positionUpdated', payload, cb);
  },

  redo_updateBitPosition: function (payload, cb) {
    this._updateBitPosition('redo_updateBitPosition', 'bit.redo_positionUpdated', payload, cb);
  },

  updateBitContent: function (payload, cb) {
    this._updateBitContent('updateBitContent', 'bit.contentUpdated', payload, cb);
  },

  undo_updateBitContent: function (payload, cb) {
    this._updateBitContent('undo_updateBitContent', 'bit.undo_contentUpdated', payload, cb);
  },

  redo_updateBitContent: function (payload, cb) {
    this._updateBitContent('redo_updateBitContent', 'bit.redo_contentUpdated', payload, cb);
  },

  uploadImage: function (payload, cb) {
    this._uploadImage('uploadImage', 'bit.uploadImage', payload, cb);
  },

  undo_uploadImage: function (payload, cb) {
    this._uploadImage('undo_uploadImage', 'bit.undo_uploadImage', payload, cb);
  },

  redo_uploadImage: function (payload, cb) {
    this._uploadImage('redo_uploadImage', 'bit.redo_uploadImage', payload, cb);
  },

  clipWebpage: function (payload, cb) {
    this._clipWebpage('clipWebpage', 'bit.clipWebpage', payload, cb);
  },

  undo_clipWebpage: function (payload, cb) {
    this._clipWebpage('undo_clipWebpage', 'bit.undo_clipWebpage', payload, cb);
  },

  redo_clipWebpage: function (payload, cb) {
    this._clipWebpage('redo_clipWebpage', 'bit.redo_clipWebpage', payload, cb);
  }
});
