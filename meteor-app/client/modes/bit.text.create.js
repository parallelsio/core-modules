Parallels.AppModes['create-bit'] = {

  enter: function (event) {
    console.log("mode:create-bit:enter");

    Parallels.Keys.disableAll();
    Parallels.Keys.bindEsc();

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

  success: function(template, createTextBit){
    console.log("mode:create-bit:success");

    Meteor.call('changeState', {
      command: 'createBit',
      data: {
        canvasId: createTextBit.canvasId,
        type: createTextBit.type,

        // TODO: sanitize?
        content: template.find('.editbit').value.trim(),
        color: createTextBit.color,
        position: {
          x: $(template.firstNode).position().left,
          y: $(template.firstNode).position().top
        }
      }
    });

    Parallels.Audio.player.play('fx-cha-ching');
    Parallels.Keys.bindAll();

    Session.set('currentMode', null);
    Session.set('createTextBit', null);

  },

  exit: function () {
    console.log("mode:create-bit:exit");

    // TODO: play zoop sound
    Parallels.Audio.player.play('fx-temp-temp');
    Parallels.Keys.bindAll();

    Session.set('currentMode', null);
    Session.set('createTextBit', null);
  }
};
