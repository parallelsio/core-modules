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

    // set up tracker autorun computation
    // whenever the strokes array is updated
    // run the .update function to 
    // get ploma instance
    // var bitData = bitTemplate.templateInstance().plomaInstance.getStrokes();
    // Parallels.AppModes['sketch-bit'].success(template, sketchBit);
   
    Tracker.autorun(function() {
      console.log(Session.get('sketchBit'), sketchBit.content, ', via Tracker:autorun');
       $bit = $(".bit.sketch");
      var bitTemplate = Blaze.getView($bit[0]);
      var bitData = bitTemplate.templateInstance().plomaInstance.getStrokes();
    });


  },

  update: function(){
    var sketchBit = Session.get('sketchBit');
    
    if (this.content != bitData) {
      Meteor.call('changeState', {
        command: 'updateBitContent',
        data: {
          canvasId: '1',
          _id: this._id,
          content: sketchBit.content
        }
      });
    }
  },

  exit: function (sketchBit) {
    console.log("mode:sketch-bit:exit");

    Parallels.Keys.bindAll();

    // TODO: use data id, this will be unreliable when more than one sketch bit instance
    // is on the canvas.
    $bit = $(".bit.sketch");
    var bitTemplate = Blaze.getView($bit[0]);
    var sketchBit = Session.get('sketchBit');
    var bitData = bitTemplate.templateInstance().plomaInstance.getStrokes();
    console.log("plomaInstance:", bitData);

    Meteor.call('changeState', {
      command: 'createBit',
      data: {
        canvasId:   sketchBit.canvasId,
        type:       sketchBit.type,
        content:    sketchBit.content,
        color:      sketchBit.color,
        position: {
          // x: $(template.firstNode).position().left,
          // y: $(template.firstNode).position().top
          x: 50,
          y: 80
        }
      }
    });

    Session.set('sketchBit', null);
    Session.set('currentMode', null);


  }
};
