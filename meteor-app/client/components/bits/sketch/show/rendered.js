/* 
  Ploma only does rendering
  doesnt care where location + pressure data come from
  Ploma can be used with any tablet

  SD/OQ:  - Any benefit of using Meteor template event map,
            versus doing it here?

          - Use a local collection to cache strokes to minimize
            delays/writes to db?

*/


var unbindPlomaHandlers = function(canvas){
  canvas.onmousedown,
  canvas.onmousemove, 
  canvas.onmouseup = null;
}; 

var createPlomaCanvas = function(template, canvas){

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
    // Parallels.Audio.player.play('fx-cinq-drop');

    // disabled - need to make sure performance is snappy first
    // template.firstNode.style.cursor = 'none';
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
  }

  template.firstNode.style.cursor = 'crosshair';

  // SD: OQ: is this hurting performance?
  // Parallels.Audio.player.play('fx-ting3');
  return ploma;
};
  

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
  log.debug("bit:sketch:render");  
  
  var template = this;
  var canvas = $(template.firstNode).find(".sketch-bit")[0];

  // save a reference to the plomaCanvas to the template instance 
  // as a property, so we can later access it and pull it down ,
  // stop the handlers, when no longer in use 
  template.plomaInstance = createPlomaCanvas(template, canvas);

   // TODO : reuse same drag init as bit.rendered (with effects, etc)
  // Draggable.create(this.firstNode, {
  //   throwProps:false,
  //   zIndexBoost:false
  // });

  // TODO: into a 'sketch-mode'
  // Parallels.AppModes['bit-sketch'].enter();


  // draw the canvas from data, if available

  // bind sketch key handlers

  // Parallels.AppModes['bit-sketch'].enter()

  // for debugging - print the ploma instance arrays
  Mousetrap.bind(['a'], function (){
    log.debug("pressed 'a' key");  

    log.debug("bit:sketch:getStrokes: ", template.plomaInstance.getStrokes());
    log.debug("bit:sketch:curStroke: ", template.plomaInstance.curStroke());
  });

  Mousetrap.bind(['command+z', 'ctrl+z'], function (){
    log.debug("pressed 'command/ctrl + z'");  
  
    // remove the most recent stroke
    template.plomaInstance.setStrokes(
      _.dropRight(
        template.plomaInstance.getStrokes()
      )
    );

  });

  Mousetrap.bind('c', function (){
    log.debug("pressed 'c' key");  
    var bitHoveringId = Session.get('bitHoveringId');

    // TODO: only if hovering over a bit, once this is moved from map to
    // if (bitHoveringId) {
      log.debug("clearing bit:sketch canvas on ", bitHoveringId);
      Parallels.Audio.player.play('fx-pep');
      template.plomaInstance.clear();
      // TODO: bind clear to bit.content data reactively
    // }
  });

  Mousetrap.bind('up', function (){
    log.debug("pressed 'up' key");  
    event.preventDefault();

    Parallels.Audio.player.play('fx-pep');
    var opacity = Number(template.firstNode.style.opacity);
    log.debug("bit:sketch:opacity = ", opacity);  

    if (opacity < 1){
      template.firstNode.style.opacity = (opacity + 0.10);
    }
    else { Parallels.Audio.player.play('fx-tri'); }

  });

  Mousetrap.bind('down', function (){
    log.debug("pressed 'down' key");  
    event.preventDefault();

    Parallels.Audio.player.play('fx-pep');
    var opacity = Number(template.firstNode.style.opacity);
    log.debug("bit:sketch:opacity = ", opacity);  

    if (opacity > 0.10){
      template.firstNode.style.opacity = (opacity - 0.10);
    }
    else { Parallels.Audio.player.play('fx-tri'); }

  });
});