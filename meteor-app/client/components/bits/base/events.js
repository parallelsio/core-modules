BitEvents = {

  // prevents bits that were under the bit person is dragging, from starting to highlight
  // TODO: refactor to use GSAP built in methods, to test if something is being dragged?
  hoverInBit: function (event, template) {
    if (!Session.get('mousedown')) {
      // SD: OQ/TODO: this fails on bit:delete, how can we reuse this function?
      var $bitElement = $(template.firstNode);
      $bitElement.addClass('hovering');
      $bitElement.find('.bit__controls-persistent').show();
      Session.set('bitHoveringId', template.data._id);

      Parallels.Audio.player.play('fx-ting3');

      if (template.data.type === 'text'){
        Session.set('textBitEditingId', template.data._id);
        $bitElement.find('.bit--editing').focus();
        $bitElement.find('.bit__resize').show();

        var $editingElement = $bitElement.find('.bit--editing');
        $editingElement.attr('contenteditable', 'true');
        $editingElement.attr('data-clickable', 'true');
      }
    }
  },

  hoverOutBit: function (event, template){

    if (!Session.get('mousedown')) {
      Session.set('bitHoveringId', null);

      var $bitElement = $(template.firstNode);
      $bitElement.removeClass('hovering');
      $bitElement.find('.bit__controls-persistent').hide();

      if (template.data.type === 'text'){
        Session.set('textBitEditingId', null);
        $bitElement.find('.bit__resize').hide();

        var $editingElement = $(template.find('.bit--editing'));
        $editingElement.attr('contenteditable', 'false');
        $editingElement.attr('data-clickable', 'false');

        if (this.content != $editingElement.html()) {
          Meteor.call('changeState', {
            command: 'updateBitContent',
            data: {
              canvasId: Session.get('canvasId'),
              _id: this._id,
              content: $editingElement.html(),
              height: $editingElement.height(),
              width: $editingElement.width()
            }
          });

          Parallels.Audio.player.play('fx-cha-ching');
        }
      }
    }
  }
};



// for more bit events see /client/lib/key-bindings.js
Template.bit.events({

  'mouseenter .bit': BitEvents.hoverInBit,

  'mouseleave .bit': BitEvents.hoverOutBit,

  'mousedown .bit': function () {
    Session.set('mousedown', true);

    // avoid interference with making marquee/select bits
    event.stopPropagation(); 
  },

  'mouseup .bit': function () {
    Session.set('mousedown', false);
  },

  'dblclick .bit': function(e){
    e.stopPropagation();
  },

  'click .controls__icon-delete': function (event, template) {

    Parallels.log.debug("starting bit:delete on ", template.data._id);
    Parallels.Audio.player.play('fx-tri');

      Meteor.call('changeState', {
        command: 'deleteBit',
        data: {
          canvasId: Session.get('canvasId'),
          _id: template.data._id
        }
      });

    Session.set('textBitEditingId', null);
  }

});
