Parallels.AppModes['create-bit'] = {
  enter: function (event) {
    Session.set('currentMode', 'create-bit');

    var id = Bits.insert({
      content: '',
      type: 'text',
      color: 'white',
      position_x: event.pageX,
      position_y: event.pageY
    });

    Session.set('bitEditingId', id);
  },
  exit: function () {
    Session.set('currentMode', null);
    var bitEditingId = Session.get('bitEditingId');
    if (bitEditingId)
    {
      Bits.remove( bitEditingId );
      Session.set('bitEditingId', null);
    }
  }
};
