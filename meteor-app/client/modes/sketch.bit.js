Parallels.AppModes['sketch-bit'] = {
  enter: function () {
    Session.set('currentMode', 'sketch-bit');
    Session.set('sketchBit', { 
      canvasId: '1',
      type: 'sketch',
      color: 'blue',
      content: [],
      position: {
        x: 300,
        y: 300
      }
    });
  },
  exit: function () {
    Session.set('currentMode', null);
    Session.set('sketchBit', null);
  }
};
