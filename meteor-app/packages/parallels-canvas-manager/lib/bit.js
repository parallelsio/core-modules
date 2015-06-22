Bit = function Bit (payload) {
  this._id = Random.id();
  _.extend(this, payload);
};

ParallelsCanvasManager.Bit = Bit;
