Template.bit.onDestroyed(function(){
  // fails, because there's no template instance after the delete
  // BitEvents.hoverOutBit();
  Session.set('bitHoveringId', null);
});