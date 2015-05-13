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
    Meteor.call('createBit', newBitAttributes, function (err, id) {
      log.debug(err);
      Session.set('bitEditingId', id);
    });
  },
  exit: function () {
    Session.set('currentMode', null);
    var bitEditingId = Session.get('bitEditingId');
    if (bitEditingId)
    {
      Meteor.call('deleteBit', bitEditingId);
      Session.set('bitEditingId', null);
    }
  }
};
