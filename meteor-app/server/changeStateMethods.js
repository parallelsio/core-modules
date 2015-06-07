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
    var getCanvas = Meteor.wrapAsync(CanvasRepo.get, CanvasRepo);
    var commitRepo = Meteor.wrapAsync(CanvasRepo.commit, CanvasRepo);

    var canvas = getCanvas(msg.data.canvasId);
    var canvasAction = canvas[msg.command];

    if (canvasAction) {
      var action = Meteor.wrapAsync(canvasAction, canvas);
      var response = action(msg.data);
      commitRepo(canvas, {/* forceSnapshot: true */});
      console.log("changeState: complete: canvas (%s) v%s", canvas.id, canvas.version);
      return response;
    } else {
      log.error("changeState: Command not recognized : ", canvasAction);
    }
  }
};

// Given a canvasId and a version number, this method will return the specific details for the event
// including original data and command that was executed. We use this to support rolling back and replaying
// events.

var _findEventDetails = Meteor.wrapAsync(function (canvasId, version, callback) {
  CanvasRepo.events
    .find({ id: canvasId, version: version })
    .toArray(function (err, events) {
      if (err) callback(err);
      callback(null, events[0]);
    });
});

Meteor.methods({

  changeState: _changeState,

  undoState: function (data) {
    var event = findMostRecentUndoableEvent(data.canvasId);
    if (event) {
      var eventDetails = _findEventDetails(event.canvasId, event.version);
      var undoEvent = 'undo_' + eventDetails.method.replace(/undo_|redo_/, "");

      _changeState({command: undoEvent, data: eventDetails.data.original});
    }
  },

  redoState: function (data) {
    var event = findOldestReplayableEvent(data.canvasId);
    if (event) {
      var eventDetails = _findEventDetails(event.canvasId, event.version);
      var redoEvent = 'redo_' + eventDetails.method.replace(/undo_|redo_/, "");

      _changeState({command: redoEvent, data: eventDetails.data});
    }
  }
});
