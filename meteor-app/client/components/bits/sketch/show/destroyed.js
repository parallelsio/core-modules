Template.sketchBit.onDestroyed(function(){
  unbindPlomaHandlers(canvas);

  log.debug("bit:sketch:destroy");  

  // fails, because there's no template instance after the delete
  // BitEvents.hoverOutBit();
  Session.set('bitHoveringId', null);

  Parallels.KeyCommands.bindUndo();
  Mousetrap.unbind('a');
  Mousetrap.unbind('c');
  Mousetrap.unbind('up');
  Mousetrap.unbind('down');

  // fails - doesnt exist anymore
  // template.plomaInstance.clear();
  // template.plomaInstance = null;
});
