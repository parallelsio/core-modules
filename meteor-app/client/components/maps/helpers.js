Template.map.helpers({
  textBits: function() {
    return Bits.find();
  },
  sketchBits: function() {
    return Bits.find();
  },
  isCreatingNewTextBit: function () {
    return Session.get('newTextBit');
  },
  isCreatingSketchBit: function () {
    return Session.get('sketchBit');
  }
});
