var RollbackReplayStack = new Meteor.Collection('rollback.replay');

var _findMostRecentUndoableEvent = Meteor.wrapAsync(function (entityId, callback) {
  var event = RollbackReplayStack.findOne({entityId: entityId, rolledBack: null}, {sort: {version: -1}});
  callback(null, event);
});

var _findOldestReplayableEvent = Meteor.wrapAsync(function (entityId, callback) {
  var event = RollbackReplayStack.findOne({entityId: entityId, replayable: true}, {sort: {version: 1}});
  callback(null, event);
});

var insertNewEvent = Meteor.bindEnvironment(function (payload) {
  var entity = payload.data.entity;

  RollbackReplayStack.insert({
    entityId: entity.id,
    version: entity.version
  });

}, function (err) { console.error('eventLog:insertNewEvent', err); });

var recordEventRollback = Meteor.bindEnvironment(function (payload) {
  var entity = payload.data.entity;

  var query = {
    $set: {
      rolledBack: true,
      replayable: true
    }
  };

  var event = _findMostRecentUndoableEvent(entity.id);
  if (event) {

    RollbackReplayStack.update(event._id, query, function (err /*, result */) {
      if (err) console.error(err);
    });
  }
}, function (err) { console.error('eventLog:recordEventRollback', err); });

var recordEventReplay = Meteor.bindEnvironment(function (payload) {
  var entity = payload.data.entity;

  var query = {
    $unset: {
      rolledBack: "",
      replayable: ""
    }
  };

  var event = _findOldestReplayableEvent(entity.id);
  if (event) {
    RollbackReplayStack.update(event._id, query, function (err /*, result */) {
      if (err) console.error(err);
    });
  }

}, function (err) { console.error('eventLog:recordEventReplay', err); });

var resetReplayableEvents = Meteor.bindEnvironment(function (payload) {
  var entity = payload.data.entity;

  var query = {
    $unset: {
      replayable: ""
    }
  };

  RollbackReplayStack.update({ entityId: entity.id, replayable: true}, query, { multi: true }, function (err /*, result */) {
    if (err) console.error(err);
  });

}, function (err) { console.error('eventLog:resetReplayableEvents', err); });

InfiniteUndo.EventStream.on('entity.**', function (payload) {
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

_.extend(InfiniteUndo, {
  RollbackReplayStack: RollbackReplayStack,
  findMostRecentUndoableEvent: _findMostRecentUndoableEvent,
  findOldestReplayableEvent: _findOldestReplayableEvent
});
