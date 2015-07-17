Template.sketchBit.onDestroyed(function () {
  log.debug("bit:sketch:destroy");
  Session.set('bitHoveringId', null);
});
