Parallels.AppModes['create-bit'] = {
  enter: function (event) {
    Session.set('currentMode', 'create-bit');
    Session.set('newTextBit', {
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
    Session.set('currentMode', null);
    Session.set('newTextBit', null);
  }
};
