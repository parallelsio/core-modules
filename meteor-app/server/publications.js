Meteor.publish('bits', function() {
  return Bits.find();
});

Meteor.publish('errors', function() {
  return Errors.find();
});

Meteor.publish('Canvas.events', function() {
  return CanvasEvents.find();
});
