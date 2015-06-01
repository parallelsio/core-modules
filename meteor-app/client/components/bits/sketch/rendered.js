// Ploma only does rendering
// doesnt care where location + pressure data come from
// Ploma can be used with any tablet
var createPlomaCanvas = function(template){

  var canvas = $(template.firstNode).find("#sketch-bit")[0];

  // NAPAPI, necessary for interfacing with Wacom tablet
  var plugin = document.getElementById('wtPlugin'); 
  var isDrawing = false;
  var ploma = new Ploma(canvas);

  ploma.clear();

  // begin a stroke at the mouse down point
  canvas.onmousedown = function(event) {
    isDrawing = true;
    var point = getEventPoint(event, template, plugin);
    ploma.beginStroke(point.x, point.y, point.p);
    Parallels.Audio.player.play('fx-cinq-drop');
  }

  // extend the stroke at the mouse move point
  canvas.onmousemove = function(event) {
    if (!isDrawing) return;
    var point = getEventPoint(event, template, plugin);
    ploma.extendStroke(point.x, point.y, point.p);
  }

  // end the stroke at the mouse up point
  canvas.onmouseup = function(event) {
    isDrawing = false;
    var point = getEventPoint(event, template, plugin);
    ploma.endStroke(point.x, point.y, point.p);
    Parallels.Audio.player.play('fx-ting3');
  }

  return ploma;
}
  

var getEventPoint = function(event, template, plugin){

  var point = {};

  // recalc mouse coordinates, accounting for combination of 2 things:
  // 1) where the bit sits, offset from 0,0 via the template instance 
  // 2) if person is scrolled away from default viewport, via the Window object
  point.x = (window.pageXOffset + event.clientX) - $(template.firstNode).position().left;
  point.y = (window.pageYOffset + event.clientY) - $(template.firstNode).position().top;

  // fail gracefully if no pressure is detected (no tablet found)
  // tablet reports a range of 0 to 1
  point.p = plugin.penAPI.pressure ? plugin.penAPI.pressure : 0.6;
  return point;
}


Template.sketchBit.onRendered(function (){
  log.debug("rendered sketch bit");  
  
  var template = this;

   // TODO : reuse same drag init as bit.rendered (with effects, etc)
  // Draggable.create(this.firstNode, {
  //   throwProps:false,
  //   zIndexBoost:false
  // });

  // TODO: into a 'sketch-mode'
  // Parallels.AppModes['bit-sketch'].enter();
  var plomaInstance = createPlomaCanvas(template);

  Mousetrap.bind('c', function (){
    log.debug("pressed 'c' key");  
    var bitHoveringId = Session.get('bitHoveringId');

    // TODO: only if hovering over a bit, once this is moved from map to
    // if (bitHoveringId) {
      log.debug("clearing bit:sketch canvas on ", bitHoveringId);
      Parallels.Audio.player.play('fx-pep');
      plomaInstance.clear();
      // TODO: bind clear to bit.content data reactively
    // }
  });

});