Parallels.AppModes['create-bit'] = {
  enter: function (event) {
    Session.set('currentMode', 'create-bit');

    var newBitAttributes = {
      type: 'text',
      color: 'white',
      position: {
        x: event.pageX,
        y: event.pageY
      }
    };
    Meteor.call('insertBit', newBitAttributes, function (err, id) {
      console.log(err);
      Session.set('bitEditingId', id);
    });

    Session.set('bitEditingId', id);
  },
  exit: function () {
    Session.set('currentMode', null);
    var bitEditingId = Session.get('bitEditingId');
    if (bitEditingId)
    {
      Meteor.call('removeBit', bitEditingId);
      Session.set('bitEditingId', null);
    }
  }
};
