Meteor.publish('Drawer.bits', function() {
  return Bits.find( {}, { sort: { createdAt: -1 } });
});

Meteor.publish('Canvas.bits', function(canvasId) {
  return Bits.find({ canvasId: canvasId });
});

Meteor.publish('errors', function() {
  return Errors.find();
});

Meteor.publish('Canvas.events', function() {
  return CanvasEvents.find( {}, { sort: { timestamp: -1 }, limit: 50 });
});

