
// This collection of event versions is used to record what events have been rolled back and replayed.

var insertNewEvent = Meteor.bindEnvironment(function (payload) {
  var canvas = payload.data.canvas;
  var bit = payload.data.bit;
  log.debug('eventLog:insertNewEvent: canvas:', canvas.id, bit._id);

  RollbackReplayStack.insert({
    canvasId: canvas.id,
    bitId: bit._id,
    version: canvas.version
  });

}, function (err) { log.error('eventLog:insertNewEvent', err); });

var recordEventRollback = Meteor.bindEnvironment(function (payload) {
  var canvas = payload.data.canvas;

  var query = {
    $set: {
      rolledBack: true,
      replayable: true
    }
  };

  var event = findMostRecentUndoableEvent(canvas.id);
  if (event) {
    log.debug('eventLog:recordEventRollback: canvas:', canvas.id, event._id);

    RollbackReplayStack.update(event._id, query, function (err /*, result */) {
      if (err) log.error(err);
    });
  }
}, function (err) { log.error('eventLog:recordEventRollback', err); });

var recordEventReplay = Meteor.bindEnvironment(function (payload) {
  var canvas = payload.data.canvas;

  var query = {
    $unset: {
      rolledBack: "",
      replayable: ""
    }
  };

  var event = findOldestReplayableEvent(canvas.id);
  if (event) {
    log.debug('eventLog:recordEventReplay: canvas:', canvas.id, event._id);

    RollbackReplayStack.update(event._id, query, function (err /*, result */) {
      if (err) log.error(err);
    });
  }

}, function (err) { log.error('eventLog:recordEventReplay', err); });

var resetReplayableEvents = Meteor.bindEnvironment(function (payload) {
  var canvas = payload.data.canvas;

  var query = {
    $unset: {
      replayable: ""
    }
  };

  log.debug('eventLog:resetReplayableEvents: canvas:', canvas.id);

  RollbackReplayStack.update({ canvasId: canvas.id, replayable: true}, query, { multi: true }, function (err /*, result */) {
    if (err) log.error(err);
  });

}, function (err) { log.error('eventLog:resetReplayableEvents', err); });

StateChangeEvents.on('canvas.bit.*', function (payload) {
  var isRollback = this.event.indexOf('undo_') >= 0;
  var isReplay = this.event.indexOf('redo_') >= 0;

  if (isRollback) {
    recordEventRollback(payload);
  } else if (isReplay) {
    recordEventReplay(payload);
  } else {
    resetReplayableEvents(payload);
    insertNewEvent(payload);
  }
});
