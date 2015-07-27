var util = Npm.require('util');

Canvas = function Canvas () {
  this.bits = [];
  InfiniteUndo.Entity.apply(this, arguments);
};

util.inherits(Canvas, InfiniteUndo.Entity);

var readonlyCanvases = (process.env.PARALLELS_READONLY_CANVASES || '')
  .split(/\s*,\s*/)
  .map(function(value) {
    return '' + value.trim();
  });

Canvas.prototype.isReadonly = function () {
  return readonlyCanvases.indexOf(this.id) >= 0;
};

ParallelsCanvasManager.Canvas = Canvas;
