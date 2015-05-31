Router.route('/import-eventlog', function(){
  var responseMessage, events;

  events = JSON.parse(Assets.getText("data-backups/canvas.events.json"));

  if (!events || !Array.isArray(events)) {
    this.response.statusCode = 400;
    responseMessage = "\n\nSomething is wrong with the data you are trying to import.\n\n"
  } else if (events.length < 1) {
    this.response.statusCode = 400;
    responseMessage = "\n\nYou didn't give me any events to import.\n\n";
  } else {
    events.forEach(function (event) {
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
