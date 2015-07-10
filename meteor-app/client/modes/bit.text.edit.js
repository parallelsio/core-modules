Parallels.AppModes['edit-bit'] = {

  enter: function (id) {
    console.log("bit:edit-bit:enter");

    Parallels.Audio.player.play('fx-temp-temp-subtle');

    var bitTemplate = Utilities.getBitTemplate(id);
    var bitData = Blaze.getData(bitTemplate);

    // currently, we're only supporting edit for text type
    // TODO: make other modes contain enter checking logic?
    // or move this logic outside to wrap the calling function
    if (bitData.type === "text") {
      Session.set('currentMode', 'edit-bit');
      Session.set('bitEditingId', id);
      console.log("bit:edit-bit:enter: " + Session.get('bitEditingId'));
    }

    else {
      console.log("bit:edit: bit not of type 'text'. Can't edit this yet.");
    }

  },

  exit: function () {
    console.log("mode:edit-bit:exit");
    Session.set('currentMode', null);
    Session.set('bitEditingId', null);
  }
};
