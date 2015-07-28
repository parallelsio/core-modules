Router.route('/import-eventlog', function () {
  var responseMessage, events, canvasIdOverride = this.params.query.canvasIdOverride;
  var importedEventsCollection = new Meteor.Collection("imported.events");
  var importedEvents = importedEventsCollection.find({}, {sort: {version: 1}});

  if (importedEvents.count() < 1) {
    this.response.statusCode = 400;
    responseMessage = "\n\nYou didn't give me any events to import.\n\n";
  } else {
    importedEvents.forEach(function (event) {
      var eventData = event.data;
      if (canvasIdOverride) {
        eventData = _.extend({}, event.data);
        eventData.canvasId = canvasIdOverride;
        eventData.original.canvasId = canvasIdOverride;
      }
      Meteor.call('changeState', {
        command: event.method,
        data: eventData
      });
    });
    importedEventsCollection.remove({});
    this.response.statusCode = 200;
    responseMessage = "\n\nCheck your canvas! You should have some new data.\n\n";
  }

  this.response.setHeader("Content-Type", "application/json");
  this.response.end(responseMessage);

}, {where: 'server'});
