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

Template.sketchBit.events({
  'mouseenter .bit': BitEvents.hoverInBit,
  'mouseleave .bit': BitEvents.hoverOutBit
});
