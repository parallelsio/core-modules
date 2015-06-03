Template.sketchBit.onDestroyed(function(){
  log.debug("bit:sketch:destroy");  

  // fails, because there's no template instance after the delete
  // BitEvents.hoverOutBit();
  Session.set('bitHoveringId', null);

  Mousetrap.unbind(['command+z', 'ctrl+z']);
  Mousetrap.unbind('c');

  // fails - doesnt exist anymore
  // plomaInstance.clear();
  // plomaInstance = null;
});
