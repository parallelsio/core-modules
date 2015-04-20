BitEvents = {
  toggleSelectedClass: function (event, template) {
    event.preventDefault();
    event.stopPropagation();

    if (event.target.classList.contains('bit')) {
      Session.set('bitHoveringId', template.data._id);
      console.log("bit:hover:in " + Session.get('bitHoveringId'));

      // TODO: shimmer on hover
      // TODO: scale
      // TweenLite.to(Template.instance().firstNode, 0.3, { left:"+=10px", ease:Elastic.easeOut});
      // var yoyo = myTimeline.yoyo(); //gets current yoyo state
      // myTimeline.yoyo( true ); //sets yoyo to true

      $(event.target).addClass('selected');
    }
  }
};

Template.bit.events({

  'mouseenter .bit': BitEvents.toggleSelectedClass,

  'mouseleave .bit': function (event, template){
    event.preventDefault();
    event.stopPropagation();

    if (event.target.classList.contains('bit')) {
      Session.set('bitHoveringId', '');
      console.log("bit:hover:out " + Session.get('bitHoveringId'));
      // $(event.target).removeClass('selected');

    }
  },

  'click .bit': function (event, template){

    // TODO: Zelda triforce focus here, zoom sound
    console.log("bit:click: " + this._id);
  },

  'dblclick .bit': function (event, template){
    event.preventDefault();
    event.stopPropagation();

    Session.set('bitEditingId',this._id);
    console.log("bit:edit: " + Session.get('bitEditingId'));
  },

  'keyup .bit': function (event, template){
    event.stopPropagation();
    event.preventDefault();

    // console.log('bit:key up: key code:' + event.which + ': ');

    if(event.which === 13){
      Bits.update( this._id , {
        $set: { "content": template.find('.editbit').value }
      });

      Sound.play('ch-chaing-v2.mp3');

      Session.set('bitEditingId',null);
    }
  }
});
