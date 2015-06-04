Parallels.AppModes['edit-bit'] = {
  
  enter: function (id) {
    log.debug("bit:edit-bit:enter");

    Parallels.Audio.player.play('fx-temp-temp-subtle');

    var $bit = $("[data-id='" + id + "']");
    var bitTemplate = Blaze.getView($bit[0]);
    var bitData = Blaze.getData(bitTemplate);

    // currently, we're only supporting edit for text type
    // TODO: make other modes contain enter checking logic?
    // or move this logic outside to wrap the calling function
    if (bitData.type === "text") {
      Session.set('currentMode', 'edit-bit');
      Session.set('bitEditingId', id);
      log.debug("bit:edit-bit:enter: " + Session.get('bitEditingId'));
    }

    else {
      log.debug("bit:edit: bit not of type 'text'. Can't edit this yet."); 
    }

  },

  exit: function () {
    log.debug("mode:edit-bit:exit");

    Session.set('currentMode', null);
    Session.set('bitEditingId', null);

    Meteor.call('changeState', {
      command: 'deleteBit',
      data: {
        canvasId: '1',
        _id: bitEditingId
      }
    });
  }
};



