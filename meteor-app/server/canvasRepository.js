Meteor.startup(function () {
  canvasRepository = new InfiniteUndo.EntityRepository(ParallelsCanvasManager.Canvas);
});
