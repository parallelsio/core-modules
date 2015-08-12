BitEvents = {

  // TODO: clean up

  hoverInBit: function (event, template) {
    // prevents bits that were under the bit person is dragging, from starting to highlight
    // TODO: refactor to use GSAP built in methods, to test if something is being dragged?
    if (!Session.get('mousedown')) {
      Session.set('bitHoveringId', template.data._id);

      Parallels.Audio.player.play('fx-ting3');

      // SD: OQ/TODO: this fails on bit:delete, how can we reuse this function?
      var $bitElement = $(template.firstNode);
      $bitElement.addClass('hovering');
    }
  },

  hoverOutBit: function (event, template){
    if (!Session.get('mousedown')) {
      Session.set('bitHoveringId', null);

      var $bitElement = $(template.firstNode);
      $bitElement.removeClass('hovering');

      if (Session.get('textBitEditingId')){
        Parallels.AppModes['edit-text-bit'].exit($bitElement, template);
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

  'dblclick .bit': function (event, template) {
    event.stopPropagation() // so map doesnt register a double click

    var $bitElement = $(template.firstNode);
    // var bitData = Blaze.getData(event.target);
    if (template.data.type === "text" && Session.equals('textBitEditingId', null)){
      Session.set('textBitEditingId', template.data._id);
      Parallels.AppModes['edit-text-bit'].enter($bitElement, template);
    }

    // else if (bitData.type === "sketch") {
    //   Parallels.AppModes['sketch-bit'].
    // }
  }

});
