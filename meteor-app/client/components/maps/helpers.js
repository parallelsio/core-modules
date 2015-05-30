// https://stackoverflow.com/questions/21296712/merging-collections-in-meteor

Template.map.helpers({

  allTypesBits: function(){
    return Bits.find();
  },

  textBits: function() {
    return Bits.find({type: "text"});
  },

  sketchBits: function() {
    return Bits.find({type: "sketch"});
  },

  imageBits: function(){
    return Bits.find({type: "image"});
  },

  webPageBits: function(){
    return Bits.find({type: "webpage"});
  },

  isCreatingNewTextBit: function () {
    return Session.get('newTextBit');
  },

  isCreatingSketchBit: function () {
    return Session.get('sketchBit');
  }
});
