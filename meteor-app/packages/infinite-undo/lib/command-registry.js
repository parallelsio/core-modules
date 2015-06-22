function CommandRegistry () {
  var self = this;
  self.registeredEvents = [];
}

CommandRegistry.prototype.registerCommand = function (prototype, commandDefinition) {
  var self = this;

  if (prototype[commandDefinition.name]) {
    throw new Error("Canvas object already has the " + commandDefinition.name + " command defined.");
  } else {
    var undoFn = 'undo_' + commandDefinition.name;
    var undoEventName = commandDefinition.event.replace('bit\.', 'bit\.undo_');
    var redoFn = 'redo_' + commandDefinition.name;
    var redoEventName = commandDefinition.event.replace('bit\.', 'bit\.redo_');

    self.registeredEvents = self.registeredEvents.concat([commandDefinition.event, undoEventName, redoEventName]);

    prototype[commandDefinition.name] = function (payload, cb) {
      var canvas = this;

      commandDefinition.execute(canvas, payload, function (err, event) {
        if (!err) {
          canvas.digest(commandDefinition.name, event.payload);
          canvas.enqueue(commandDefinition.event, event.result);
        }

        if (cb) cb(err, event.result);
      });
    };

    prototype[undoFn] = function (payload, cb) {
      var canvas = this;

      var onComplete = function (err, event) {
        if (!err) {
          canvas.digest(undoFn, event.payload);
          canvas.enqueue(undoEventName, event.result);
        }

        if (cb) cb(err, event.result);
      };

      if (commandDefinition.undo) {
        commandDefinition.undo(canvas, payload, onComplete);
      } else {
        commandDefinition.execute(canvas, payload, onComplete);
      }
    };

    prototype[redoFn] = function (payload, cb) {
      var canvas = this;

      commandDefinition.execute(canvas, payload, function (err, event) {
        if (!err) {
          canvas.digest(redoFn, event.payload);
          canvas.enqueue(redoEventName, event.result);
        }

        if (cb) cb(err, event.result);
      });
    };
  }
};

InfiniteUndo.CommandRegistry = new CommandRegistry();
