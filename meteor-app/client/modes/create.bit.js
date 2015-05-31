Parallels.AppModes['create-bit'] = {

  enter: function (event) {
    log.debug("mode:create-bit:enter");

    var center = Utilities.getViewportCenter();

    Session.set('currentMode', 'create-bit');
    Session.set('createTextBit', {
      canvasId: '1',
      type: 'text',
      color: 'white',
      content: '',
      position: {
        x: center.x,
        y: center.y
      }
    });
  },

  exit: function () {
    log.debug("mode:create-bit:exit");

    Session.set('currentMode', null);
    Session.set('createTextBit', null);
  }
};
