BitEvents = {

  hoverInBit: function (event, template) {
    Session.set('bitHoveringId', template.data._id);
    // TODO: play sound here
  },

  hoverOutBit: function (event, template){
    Session.set('bitHoveringId', null);
    // TODO: play sound here
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
      Bits.update( this._id , {
        $set: { "content": template.find('.editbit').value }
      });

      Sound.play('ch-chaing-v2.mp3');

      Session.set('bitEditingId', null);
      Session.set('currentMode', null);
    }
  }
});
