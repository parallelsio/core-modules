Template.sketchBit.onDestroyed(function(){
  log.debug("bit:sketch:destroy");  

  // fails, because there's no template instance after the delete
  // BitEvents.hoverOutBit();
  Session.set('bitHoveringId', null);
  ploma.clear();
  ploma = null;
});
