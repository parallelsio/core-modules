Router.route('/import-eventlog', function(){
  var responseMessage, events;

  var importedEventsCollection = new Meteor.Collection("imported.events");
  var importedEvents = importedEventsCollection.find({}, {sort: {version: 1}});

  if (importedEvents.count() < 1) {
    this.response.statusCode = 400;
    responseMessage = "\n\nYou didn't give me any events to import.\n\n";
  } else {
    importedEvents.forEach(function (event) {
      Meteor.call('changeState', {
        command: event.method,
        data: event.data
      });
    });
    this.response.statusCode = 200;
    responseMessage = "\n\nCheck your canvas! You should have some new data.\n\n";
  }

  this.response.setHeader("Content-Type", "application/json");
  this.response.end(responseMessage);

}, {where: 'server'});
