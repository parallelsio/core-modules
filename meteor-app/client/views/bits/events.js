BitEvents = {
  toggleSelectedClass: function (event, template) {
    if (event.target.classList.contains('bit')) {
      Session.set('bitHoveringId', template.data._id);
      console.log("bit:hover:in " + Session.get('bitHoveringId'));

      $(event.target).addClass('selected');
    }
  }
};

Template.bit.events({

  'mouseenter .bit': BitEvents.toggleSelectedClass,

  'mouseleave .bit': function () {
    console.log("bit:hover:out " + Session.get('bitHoveringId'));
  },

  'click .bit': function () {
    console.log("bit:click: " + this._id);
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
