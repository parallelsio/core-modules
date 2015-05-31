Template.createTextBit.onRendered(function () {

  // TODO : reuse same drag init as bit.rendered (with effects, etc)
  Draggable.create(Template.instance().firstNode, {
    throwProps:false,
    zIndexBoost:false
  });

});


