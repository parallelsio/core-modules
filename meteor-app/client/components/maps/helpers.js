Template.map.helpers({
  bits: function() {
    return Bits.find();
  },
  isCreatingNewTextBit: function () {
    return Session.get('newTextBit');
  },
  isCreatingSketchBit: function () {
    return Session.get('sketchBit');
  }
});
