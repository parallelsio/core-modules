// https://stackoverflow.com/questions/21296712/merging-collections-in-meteor

Template.map.helpers({

  bits: function(){
    return Bits.find();
  },

  isSketch: function () {
    return this.type === 'sketch';
  },

  viewingEventLog: function () {
    return Session.get('viewingEventLog');
  },

  viewingDrawer: function () {
    return Session.get('viewingDrawer');
  },

  selectedBitsCount: function () {
    return Session.get('selectedBitsCount');
  }

});

