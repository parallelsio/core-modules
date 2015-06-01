BitEvents = {

  hoverInBit: function (event, template) {
    Session.set('bitHoveringId', template.data._id);
    Parallels.Audio.player.play('fx-ting3');

    // SD: OQ/TODO: this fails on bit:delete, how can we reuse this function?
    var $bit = $(template.firstNode);
    $bit.addClass('hovering');
  },

  hoverOutBit: function (event, template){
    Session.set('bitHoveringId', null);
    var $bit = $(template.firstNode);
    $bit.removeClass('hovering');
  }
};



// for more bit events see /client/lib/key-bindings.js
Template.bit.events({

  'mouseenter .bit': BitEvents.hoverInBit,

  'mouseleave .bit': BitEvents.hoverOutBit,

  'dblclick .bit': function () {
    Parallels.AppModes['edit-bit'].enter(this._id);
  },

  'keyup .bit': function (event, template) {

    if(event.which === 13){

      if (this.content != template.find('.editbit').value) {
        Meteor.call('changeState', {
          command: 'updateBitContent',
          data: {
            canvasId: '1',
            _id: this._id,
            content: template.find('.editbit').value
          }
        });
      }

      Parallels.Audio.player.play('fx-cha-ching');

      Session.set('bitEditingId', null);
      Session.set('currentMode', null);
    }
  }
});
