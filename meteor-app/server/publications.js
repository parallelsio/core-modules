Meteor.publish('bits', function(canvasId) {
  return Bits.find({canvasId: canvasId});
});

Meteor.publish('errors', function() {
  return Errors.find();
});

Meteor.publish('Canvas.events', function() {
  return CanvasEvents.find({}, {sort: {timestamp: -1}, limit: 50});
});
