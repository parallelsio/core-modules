// https://stackoverflow.com/questions/21296712/merging-collections-in-meteor

Template.map.helpers({

  allTypesBits: function(){
    return Bits.find();
  },

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