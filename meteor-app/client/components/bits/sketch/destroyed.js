Template.sketchBit.onDestroyed(function () {
  console.log("bit:sketch:destroy");
  Session.set('bitHoveringId', null);
});
