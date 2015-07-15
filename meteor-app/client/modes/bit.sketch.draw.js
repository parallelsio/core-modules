Parallels.AppModes['sketch-bit'] = {

  enter: function () {
    console.log("mode:sketch-bit:enter");

    Session.set('currentMode', 'sketch-bit');

    // restore data if bit already exists

    // TODO: create a sketch fixture

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
    console.log("mode:sketch-bit:exit");

    Parallels.Keys.bindAll();

    $bit = $(".bit.sketch");
    var bitTemplate = Blaze.getView($bit[0]);
    var sketchBit = Session.get('sketchBit');
    var bitData = bitTemplate.templateInstance().plomaInstance.getStrokes();

    Meteor.call('changeState', {
      command: 'createBit',
      data: {
        canvasId: sketchBit.canvasId,
        type: sketchBit.type,
        content: bitData,
        color: sketchBit.color,
        position: sketchBit.position
      }
    });

    Session.set('sketchBit', null);
    Session.set('currentMode', null);


  }
};
