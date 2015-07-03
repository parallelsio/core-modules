var util = Npm.require('util');

Canvas = function Canvas () {
  this.bits = [];
  InfiniteUndo.Entity.apply(this, arguments);
};

util.inherits(Canvas, InfiniteUndo.Entity);

ParallelsCanvasManager.Canvas = Canvas;
