Bit = function Bit (payload) {
  _.extend(this, payload);
  this._id = Random.id();
};
