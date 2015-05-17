StateChangeEvents.on('canvas.bit.created', Meteor.bindEnvironment(function (event) {
  var bit = event.data.bit;

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
}, function (err) { log.error(err); }));

// todo: do we really need these fine grained events? Or is showing one "Bit Updated" event sufficient? Implications on UI if we merge the events?
StateChangeEvents.on('canvas.bit.positionUpdated', Meteor.bindEnvironment(function (event) {
  var bit = event.data.bit;

  var query = {
    $set: {
      position: bit.position,
      updatedAt: Date.now()
    }
  };

  Bits.update({ _id: bit._id }, query, { upsert: true }, function (err /*, result */) {
    if (err) log.error(err);
  });
}, function (err) { log.error(err); }));

StateChangeEvents.on('canvas.bit.contentUpdated', Meteor.bindEnvironment(function (event) {
  var bit = event.data.bit;

  var query = {
    $set: {
      content: bit.content,
      updatedAt: Date.now()
    }
  };

  Bits.update({ _id: bit._id }, query, { upsert: true }, function (err /*, result */) {
    if (err) log.error(err);
  });
}, function (err) { log.error(err); }));

StateChangeEvents.on('canvas.bit.uploadImage', Meteor.bindEnvironment(function (event) {
  var bit = event.data.bit;

  var query = {
    $set: {
      imageSource: bit.imageSource,
      uploadKey: bit.uploadKey,
      updatedAt: Date.now()
    }
  };

  Bits.update({ _id: bit._id }, query, { upsert: true }, function (err /*, result */) {
    if (err) log.error(err);
  });
}, function (err) { log.error(err); }));

StateChangeEvents.on('canvas.bit.clipWebpage', Meteor.bindEnvironment(function (event) {
  var bit = event.data.bit;

  var query = {
    $set: {
      html: bit.html,
      liftStatus: bit.liftStatus,
      updatedAt: Date.now()
    }
  };

  Bits.update({ _id: bit._id }, query, { upsert: true }, function (err /*, result */) {
    if (err) log.error(err);
  });
}, function (err) { log.error(err); }));

StateChangeEvents.on('canvas.bit.deleted', Meteor.bindEnvironment(function (event) {
  var bit = event.data.bit;
  Bits.remove(bit._id);
}, function (err) { log.error(err); }));
