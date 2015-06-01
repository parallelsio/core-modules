Parallels.AppModes['sketch-bit'] = {
  
  enter: function () {
    log.debug("mode:sketch-bit:enter");

    var center = Utilities.getViewportCenter();
    Session.set('currentMode', 'sketch-bit');
    Session.set('sketchBit', { 
      canvasId: '1',
      type: 'sketch',
      color: 'blue',
      content: [],
      position: {
        x: 50,
        y: 80
      }
    });
  },

  exit: function () {
    log.debug("mode:sketch-bit:exit");

    Session.set('currentMode', null);
    Session.set('sketchBit', null);
  }
};
