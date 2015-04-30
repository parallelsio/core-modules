Parallels.AppModes['edit-bit'] = {
  enter: function (id) {
    Session.set('currentMode', 'edit-bit');
    Session.set('bitEditingId', id);
    console.log("bit:edit: " + Session.get('bitEditingId'));
  },
  exit: function () {
    Session.set('currentMode', null);
    Session.set('bitEditingId', null);
  }
};
