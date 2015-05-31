Parallels.AppModes['create-bit'] = {

  enter: function (event) {
    log.debug("mode:create-bit:enter");

    Session.set('currentMode', 'create-bit');
    Session.set('createTextBit', {
      canvasId: '1', 
      type: 'text', 
      color: 'white', 
      content: '', 
      position: {
        x: event.offsetX, 
        y: event.offsetY
      }
    });
  },

  exit: function () {
    log.debug("mode:create-bit:exit");

    Session.set('currentMode', null);
    Session.set('createTextBit', null);
  }
};
