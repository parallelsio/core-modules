Parallels.AppModes['sketch-bit'] = {
  
  enter: function () {
    log.debug("mode:sketch-bit:enter");

    Parallels.Keys.disableAll();
    Parallels.Keys.bindImageBitPreview(); // to prevent browser from scrolling

    var center = Utilities.getViewportCenter();
    Session.set('currentMode', 'sketch-bit');

    // retrieve data 

    // get ploma instance
    
    // bind handler for ploma instance


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

    Parallels.Keys.bindAll();

    Session.set('currentMode', null);
    Session.set('sketchBit', null);

    // TODO: use data id, this will be unreliable when more than one sketch bit instance
    // is on the canvas. 
    $bit = $(".bit.sketch");
    bitTemplate = Blaze.getView($bit[0]);
    console.log("plomaInstance:", bitTemplate.templateInstance().plomaInstance.getStrokes());
  }
};
