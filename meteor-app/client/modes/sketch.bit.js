Parallels.AppModes['sketch-bit'] = {
  
  enter: function () {
    log.debug("mode:sketch-bit:enter");

    Parallels.KeyCommands.disableAll();
    Parallels.KeyCommands.bindImagePreview(); // to prevent browser from scrolling

    var center = Utilities.getViewportCenter();
    Session.set('currentMode', 'sketch-bit');

    // move into a fixture?
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

    Parallels.KeyCommands.bindAll();

    Session.set('currentMode', null);
    Session.set('sketchBit', null);

    // TODO: use data id, this will be unreliable when more than one sketch bit instance
    // is on the canvas. 
    // $bit = $("[data-id='" + bitSketchingId + "']");
    $bit = $(".bit.sketch");
    bitTemplate = Blaze.getView($bit[0]);
    console.log("plomaInstance:", bitTemplate.templateInstance().plomaInstance.getStrokes());
  }
};
