BitEvents = {

  hoverInBit: function (event, template) {
    
    if (event.target.classList.contains('selected') === false) {
      Session.set('bitHoveringId', template.data._id);
      log.debug("bit:hover:in : " + Session.get('bitHoveringId'));
      $(event.target).addClass('selected'); 
    }

    else { 
      log.debug("bit:hover: already hovered");
    }
  },

  hoverOutBit: function (event, template){
    log.debug("bit:hover:out : " + Session.get('bitHoveringId'));
    Session.set('bitHoveringId', null);
    $(event.target).removeClass('selected');
  }
};


Template.bit.events({

  'mouseenter .bit': BitEvents.hoverInBit,

  'mouseleave .bit': BitEvents.hoverOutBit,

  'click .bit': function () {
    log.debug("bit:click: " + this._id);
  },

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
