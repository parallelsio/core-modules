Template.sketchBit.onDestroyed(function () {
  Parallels.log.debug("bit:sketch:destroy");
  Session.set('bitHoveringId', null);
});
