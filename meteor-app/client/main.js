// core dep for animations
// https://guide.meteor.com/writing-atmosphere-packages.html#npm-dependencies
import mojs from 'mo-js';
import MojsPlayer from 'mojs-player';
import MojsCurveEditor from 'mojs-curve-editor';


Meteor.startup(function () {
  
  Parallels.log.debug("Meteor.startup begin.");

  // we enable the core *actions, ie
  // bit operations: Examples: bit:create, bit:delete, etc.
  // These get bound and unbound based on where person is,
  // what context they are
  Parallels.Keys.bindActions();

  // the core system navigation shortcuts,
  // that should persist regardless of context
  Parallels.Keys.bindEsc();
  Parallels.Keys.bindShortcuts();

  // Tracker.autorun(function () {
  //   Parallels.log.debug(Bits.find().count() + ' bits, via Tracker:autorun');
  // });

  // Tracker.autorun(function () {
  //   Parallels.log.debug('Session:bitHoveringId is now: ', Session.get("bitHoveringId"), ', via Tracker:autorun');
  // });

  var center = Utilities.getViewportCenter();
  pointerPosition = {
    x: center.x,
    y: center.y
  };

  Session.set('textBitEditingId', null);
  Session.set('sketchBitEditingId', null);
  Session.set('selectedBitsCount', 0);
  Session.set('mapWidth', 5000); // pixels
  Session.set('mapHeight', 5000); // pixels
  Session.set('viewingDrawer', false); 
  Session.set('debugAnimations', false); 

  // TODO: make as util?
  $.fn.focusWithoutScrolling = function(){
    var x = verge.scrollX(), y = verge.scrollY();
    this.focus();
    window.scrollTo(x, y);
    return this;
  };  
});
