BitEvents = {

  // prevents bits that were under the bit person is dragging, from starting to highlight
  // TODO: refactor to use GSAP built in methods, to test if something is being dragged?
  hoverInBit: function (event, template) {
    if (!Session.get('mousedown')) {
      
      Session.set('bitHoveringId', template.data._id);
      Session.set('bitEditingId', template.data._id);

      Parallels.Audio.player.play('fx-ting3');

      // SD: OQ/TODO: this fails on bit:delete, how can we reuse this function?
      var $bitElement = $(template.firstNode);
      $bitElement.find('.bit--editing').focus();
      $bitElement.addClass('hovering');
      $bitElement.find('.bit__resize').show();
      $bitElement.find('.bit__controls-persistent').show();

       var $editingElement = $bitElement.find('.bit--editing');
      $editingElement.attr('contenteditable', 'true');
      $editingElement.attr('data-clickable', 'true');
    }
  },

  hoverOutBit: function (event, template){
    if (!Session.get('mousedown')) {
      Session.set('bitHoveringId', null);

      var $bitElement = $(template.firstNode);
      $bitElement.removeClass('hovering');
      $bitElement.find('.bit__resize').hide();
      $bitElement.find('.bit__controls-persistent').hide();

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
};



// for more bit events see /client/lib/key-bindings.js
Template.bit.events({

  'mouseenter .bit': BitEvents.hoverInBit,

  'mouseleave .bit': BitEvents.hoverOutBit,

  'mousedown .bit': function () {
    Session.set('mousedown', true);
  },

  'mouseup .bit': function () {
    Session.set('mousedown', false);
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

    Session.set('bitEditingId', null);
  }

});
