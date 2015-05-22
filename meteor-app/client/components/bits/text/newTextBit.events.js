Template.newTextBit.events({
  'keyup .bit': function (event, template) {
    var newTextBit = Session.get('newTextBit');
    if (newTextBit && event.which === 13) {
      Meteor.call('changeState', {
        command: 'createBit',
        data: {
          canvasId: newTextBit.canvasId,
          type: newTextBit.type,
          content: template.find('.editbit').value,
          color: newTextBit.color,
          position: {
            x: $(Template.instance().firstNode).position().left,
            y: $(Template.instance().firstNode).position().top - Number($('.menu').css('height').replace('px', ''))
          }
        }
      });

      Parallels.Audio.player.play('fx-cha-ching');

      Session.set('currentMode', null);
      Session.set('newTextBit', null);
    }
  }
});
