Template.createTextBit.onRendered(function () {

  template = this;

  // TODO : reuse same drag init as bit.rendered (with effects, etc)
  Draggable.create(template.firstNode, {
    throwProps:false,
    zIndexBoost:false
  });

});


