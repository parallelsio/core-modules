// https://stackoverflow.com/questions/21296712/merging-collections-in-meteor

Template.map.helpers({

  bit: function(){
    return Bits.find();
  },

  isCreatingTextBit: function () {
    return Session.get('createTextBit');
  },

  isSketch: function () {
    return this.type === 'sketch';
  },

  isCreatingSketchBit: function () {
    return Session.get('sketchBit');
  },

  viewingEventLog: function () {
    return Session.get('viewingEventLog');
  }

});
