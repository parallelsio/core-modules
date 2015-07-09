// This method is the _ONLY_ way that state changes are initiated at the data layer.
// An example message to "_changeState" that will be sent from the client or rollback/replay is:
// {
//   command: 'createBit',
//   data: {
//     canvasId: 'ABC123',
//     content: 'Initial Content'
//   }
// }

var _changeState = function (msg) {
  if (msg.data.canvasId) {
    var getCanvas = Meteor.wrapAsync(canvasRepository.get, canvasRepository);
    var commitRepo = Meteor.wrapAsync(canvasRepository.commit, canvasRepository);

    var canvas = getCanvas(msg.data.canvasId);
    var canvasAction = canvas[msg.command];

    if (canvasAction) {
      var action = Meteor.wrapAsync(canvasAction, canvas);
      var response = action(msg.data);
      commitRepo(canvas, {/* forceSnapshot: true */});
      return response;
    } else {
      Parallels.log.warn("changeState: Command not recognized : ", msg.command);
    }
  }
};

// Given a canvasId and a version number, this method will return the specific details for the event
// including original data and command that was executed. We use this to support rolling back and replaying
// events.

var _findEventDetails = Meteor.wrapAsync(function (canvasId, version, callback) {
  canvasRepository.events
    .find({ id: canvasId, version: version })
    .toArray(function (err, events) {
      if (err) callback(err);
      callback(null, events[0]);
    });
});

// todo: it is confusing to have canvasId and entityId be references to the same thing. Normalize the identifier naming.
Meteor.methods({

  changeState: _changeState,

  undoState: function (data) {
    var event = InfiniteUndo.findMostRecentUndoableEvent(data.canvasId);
    if (event) {
      var eventDetails = _findEventDetails(event.entityId, event.version);
      var undoEvent = 'undo_' + eventDetails.method.replace(/undo_|redo_/, "");

      _changeState({command: undoEvent, data: eventDetails.data.original});
    }
  },

  redoState: function (data) {
    var event = InfiniteUndo.findOldestReplayableEvent(data.canvasId);
    if (event) {
      var eventDetails = _findEventDetails(event.entityId, event.version);
      var redoEvent = 'redo_' + eventDetails.method.replace(/undo_|redo_/, "");

      _changeState({command: redoEvent, data: eventDetails.data});
    }
  }
});
