Meteor.publish('drawer-bits', function() {
  return Bits.find( {}, { sort: { timestamp: -1 }, limit: 50 });
});

Meteor.publish('canvas-bits', function(canvasId) {
  return Bits.find({ canvasId: canvasId });
});

Meteor.publish('errors', function() {
  return Errors.find();
});

Meteor.publish('Canvas.events', function() {
  return CanvasEvents.find( {}, { sort: { timestamp: -1 }, limit: 50 });
});

