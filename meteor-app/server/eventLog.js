var FriendlyDescription = {
  'canvas.bit.deleted': 'Deleted bit',
  'canvas.bit.positionUpdated': 'Moved bit coordinates',
  'canvas.bit.uploadImage': 'Uploaded image for bit',
  'canvas.bit.created': 'Created a bit',
  'canvas.bit.contentUpdated': 'Updated bit',
  'canvas.bit.clipWebpage': 'Clipped webpage'
};

var insertEvent = Meteor.bindEnvironment(function (description, payload) {
  var canvas = payload.data.canvas;
  var bit = payload.data.bit;

  Events.insert({
    canvasId: canvas.id,
    description: description,
    meta: bit.filename || bit.content || bit._id,
    timestamp: canvas.timestamp,
    version: canvas.version
  });

}, function (err) { log.error(err); });

var recordEventRollback = Meteor.bindEnvironment(function (payload) {
  var canvas = payload.data.canvas;

  var query = {
    $set: {
      rolledBack: true
    }
  };
  var event = Events.findOne({ canvasId: canvas.id, rolledBack: null}, {sort: {version: -1}});
  Events.update(event._id, query, function (err /*, result */) {
    if (err) log.error(err);
  });

}, function (err) { log.error(err); });

var recordEventReplay = Meteor.bindEnvironment(function (payload) {
  var canvas = payload.data.canvas;

  var query = {
    $set: {
      rolledBack: null,
      version: canvas.version
    }
  };
  var event = Events.findOne({ canvasId: canvas.id, rolledBack: true}, {sort: {version: -1}});
  Events.update(event._id, query, function (err /*, result */) {
    if (err) log.error(err);
  });

}, function (err) { log.error(err); });

StateChangeEvents.on('canvas.bit.*', function (payload) {
  if (this.event.indexOf('undo_') >= 0) {
    recordEventRollback(payload);
  } else if (this.event.indexOf('redo_') >= 0) {
    recordEventReplay(payload);
  } else {
    insertEvent(FriendlyDescription[this.event] || this.event, payload);
  }
});
