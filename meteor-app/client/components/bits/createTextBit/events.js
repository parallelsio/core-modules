Template.createTextBit.events({
  
  'keyup .bit': function (event, template) {
    var createTextBit = Session.get('createTextBit');
    if (createTextBit && event.which === 13) {
      Meteor.call('changeState', {
        command: 'createBit',
        data: {
          canvasId: createTextBit.canvasId,
          type: createTextBit.type,
          content: template.find('.editbit').value,
          color: createTextBit.color,
          position: {
            x: $(template.firstNode).position().left,
            y: $(template.firstNode).position().top
          }
        }
      });

      Parallels.Audio.player.play('fx-cha-ching');

      Session.set('currentMode', null);
      Session.set('createTextBit', null);
    }
  }
});
