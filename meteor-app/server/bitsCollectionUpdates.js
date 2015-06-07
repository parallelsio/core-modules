// We use the Bits collection to enable reactive UI changes based on events
// invoked on a canvas and initiated from our changeStateMethods.

var BitsUI = {
  insertBit: Meteor.bindEnvironment(function (event) {
    var bit = event.data.bit;
    log.debug('bitsUI:insertBit', bit._id);

    var newBit = {
      _id: bit._id,
      url: bit.url,
      title: bit.title,
      liftStatus: bit.liftStatus,
      content: bit.content,
      type: bit.type,
      position: bit.position,
      filename: bit.filename,
      uploadKey: bit.uploadKey,
      imageSource: bit.imageSource,
      imageDataUrl: bit.imageDataUrl,
      nativeWidth: bit.nativeWidth,
      nativeHeight: bit.nativeHeight,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    Bits.insert(newBit);
  }, function (err) { log.error('bitsUI:insertBit', err); }),

  updateBitPosition: Meteor.bindEnvironment(function (event) {
    var bit = event.data.bit;
    log.debug('bitsUI:updateBitPosition', bit._id);

    var query = {
      $set: {
        position: bit.position,
        updatedAt: Date.now()
      }
    };

    Bits.update({ _id: bit._id }, query, function (err /*, result */) {
      if (err) log.error(err);
    });
  }, function (err) { log.error('bitsUI:updateBitPosition', err); }),

  updateBitContent: Meteor.bindEnvironment(function (event) {
    var bit = event.data.bit;
    log.debug('bitsUI:updateBitContent', bit._id);

    var query = {
      $set: {
        content: bit.content,
        updatedAt: Date.now()
      }
    };

    Bits.update({ _id: bit._id }, query, function (err /*, result */) {
      if (err) log.error(err);
    });
  }, function (err) { log.error('bitsUI:updateBitContent', err); }),

  updateImageSource: Meteor.bindEnvironment(function (event) {
    var bit = event.data.bit;
    log.debug('bitsUI:updateImageSource', bit._id);

    var query = {
      $set: {
        imageSource: bit.imageSource,
        uploadKey: bit.uploadKey,
        updatedAt: Date.now()
      }
    };

    Bits.update({ _id: bit._id }, query, function (err /*, result */) {
      if (err) log.error(err);
    });
  }, function (err) { log.error('bitsUI:updateImageSource', err); }),

  updateBitHtml: Meteor.bindEnvironment(function (event) {
    var bit = event.data.bit;
    log.debug('bitsUI:updateBitHtml', bit._id);

    var query = {
      $set: {
        html: bit.html,
        liftStatus: bit.liftStatus,
        updatedAt: Date.now()
      }
    };

    Bits.update({ _id: bit._id }, query, function (err /*, result */) {
      if (err) log.error(err);
    });
  }, function (err) { log.error('bitsUI:updateBitHtml', err); }),

  removeBit: Meteor.bindEnvironment(function (event) {
    var bit = event.data.bit;
    log.debug('bitsUI:removeBit', bit._id);

    Bits.remove(bit._id);
  }, function (err) { log.error('bitsUI:removeBit', err); })
};

StateChangeEvents.on('canvas.bit.created', BitsUI.insertBit);
StateChangeEvents.on('canvas.bit.undo_created', BitsUI.removeBit);
StateChangeEvents.on('canvas.bit.redo_created', BitsUI.insertBit);

StateChangeEvents.on('canvas.bit.deleted', BitsUI.removeBit);
StateChangeEvents.on('canvas.bit.undo_deleted', BitsUI.insertBit);
StateChangeEvents.on('canvas.bit.redo_deleted', BitsUI.removeBit);

StateChangeEvents.on('canvas.bit.positionUpdated', BitsUI.updateBitPosition);
StateChangeEvents.on('canvas.bit.undo_positionUpdated', BitsUI.updateBitPosition);
StateChangeEvents.on('canvas.bit.redo_positionUpdated', BitsUI.updateBitPosition);

StateChangeEvents.on('canvas.bit.contentUpdated', BitsUI.updateBitContent);
StateChangeEvents.on('canvas.bit.undo_contentUpdated', BitsUI.updateBitContent);
StateChangeEvents.on('canvas.bit.redo_contentUpdated', BitsUI.updateBitContent);

StateChangeEvents.on('canvas.bit.uploadImage', BitsUI.updateImageSource);
StateChangeEvents.on('canvas.bit.undo_uploadImage', BitsUI.updateImageSource);
StateChangeEvents.on('canvas.bit.redo_uploadImage', BitsUI.updateImageSource);

StateChangeEvents.on('canvas.bit.clipWebpage', BitsUI.updateBitHtml);
StateChangeEvents.on('canvas.bit.undo_clipWebpage', BitsUI.updateBitHtml);
StateChangeEvents.on('canvas.bit.redo_clipWebpage', BitsUI.updateBitHtml);
