// https://stackoverflow.com/questions/21296712/merging-collections-in-meteor

Template.map.helpers({

  allTypesBits: function(){
    return Bits.find();
  },

  // textBits: function() {
  //   return Bits.find({type: "text"});
  // },

  // sketchBits: function() {
  //   return Bits.find({type: "sketch"});
  // },

  // imageBits: function(){
  //   return Bits.find({type: "image"});
  // },

  // webPageBits: function(){
  //   return Bits.find({type: "webpage"});
  // },

  isCreatingTextBit: function () {
    return Session.get('createTextBit');
  },

  isCreatingSketchBit: function () {
    return Session.get('sketchBit');
  },
  
  viewingEventLog: function () {
    return Session.get('viewingEventLog');
  }
});
