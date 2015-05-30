// Sample message from the client:
// {
//   command: 'createBit',
//   data: {
//     canvasId: 'ABC123',
//     content: 'Initial Content',
//   }
// }

var getCanvas = Meteor.wrapAsync(CanvasRepo.get, CanvasRepo);
var commitRepo = Meteor.wrapAsync(CanvasRepo.commit, CanvasRepo);

Meteor.methods({

  changeState: function (msg) {
    log.debug('changeState: [command]:[canvas]:[bit]', msg.command, msg.data.canvasId, msg.data._id);
    var canvas = getCanvas(msg.data.canvasId);
    var canvasAction = canvas[msg.command];

    if (canvasAction) {
      var action = Meteor.wrapAsync(canvasAction, canvas);
      var response = action(msg.data);
      commitRepo(canvas, {/* forceSnapshot: true */});
      return response;
    } else {
      log.error("Command not recognized");
    }
  },

  undoState: function (data) {
    // Find last known "non-undo" event
    var findLastEvent = Meteor.wrapAsync(function (callback) {
      var event = Events.findOne({ canvasId: data.canvasId, rolledBack: null }, {sort: {version: -1}});
      callback(null, event);
    });

    var findEventDetails = Meteor.wrapAsync(function (canvasId, version, callback) {
      CanvasRepo.events
        .find({ id: canvasId, version: version })
        .toArray(function (err, events) {
          if (err) callback(err);
          callback(null, events[0]);
        });
    });

    var lastEvent = findLastEvent();
    if (lastEvent) {
      var eventDetails = findEventDetails(lastEvent.canvasId, lastEvent.version);

      // Perform Undo
      var canvas = getCanvas(data.canvasId);
      var undoEvent = 'undo_' + eventDetails.method.replace(/undo_|redo_/, "");
      var canvasAction = canvas[undoEvent];

      if (canvasAction) {
        var undo = Meteor.wrapAsync(canvasAction, canvas);
        var response = undo(eventDetails.data.original);
        commitRepo(canvas, {/* forceSnapshot: true */});
        return response;
      } else {
        log.error("Command not recognized:", undoEvent);
      }
    }
  },
  
  redoState: function (data) {
    var findLastEvent = Meteor.wrapAsync(function (callback) {
      var event = Events.findOne({ canvasId: data.canvasId, rolledBack: true }, {sort: {version: 1}});
      callback(null, event);
    });

    var findEventDetails = Meteor.wrapAsync(function (canvasId, version, callback) {
      CanvasRepo.events
        .find({ id: canvasId, version: version })
        .toArray(function (err, events) {
          if (err) callback(err);
          callback(null, events[0]);
        });
    });

    var lastEvent = findLastEvent();
    if (lastEvent) {
      var eventDetails = findEventDetails(lastEvent.canvasId, lastEvent.version);
      var canvas = getCanvas(data.canvasId);
      var redoEvent = 'redo_' + eventDetails.method.replace(/undo_|redo_/, "");
      var canvasAction = canvas[redoEvent];

      if (canvasAction) {
        var redo = Meteor.wrapAsync(canvasAction, canvas);
        var response = redo(eventDetails.data);
        commitRepo(canvas, {/* forceSnapshot: true */});
        return response;
      } else {
        log.error("Command not recognized:", redoEvent);
      }
    }
  }
});
