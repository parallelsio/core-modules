/*
 Ploma only does rendering
 doesnt care where location + pressure data come from
 Ploma can be used with any tablet

 SD/OQ:  - Any benefit of using Meteor template event map,
 versus doing it here?

 - Use a local collection to cache strokes to minimize
 delays/writes to db?

 */
var ploma, plugin, isDrawing, canvas;

var unbindPlomaHandlers = function () {
  canvas.onmousedown = canvas.onmousemove = canvas.onmouseup = null;
};

var getEventPoint = function (event, template, plugin) {

  var point = {};

  // recalc mouse coordinates, accounting for combination of 2 things:
  // 1) where the bit sits, offset from 0,0 via the template instance
  // 2) if person is scrolled away from default viewport, via the Window object
  // use verge lib for cross-browser compatibility
  point.x = (verge.scrollX() + event.clientX) - $(template.firstNode).position().left;
  point.y = (verge.scrollY() + event.clientY) - $(template.firstNode).position().top;

  // fail gracefully if no pressure is detected (no tablet found)
  // tablet reports a range of 0 to 1
  point.p = plugin.penAPI && plugin.penAPI.pressure ? plugin.penAPI.pressure : 0.6;
  return point;
};

function isEditing(id) {
  var currentlyEditingId = Session.get('currently-editing-id');
  return currentlyEditingId && currentlyEditingId === id;
}

function beginEditing(template) {

  // begin a stroke at the mouse down point
  canvas.onmousedown = function (event) {
    isDrawing = true;
    var point = getEventPoint(event, template, plugin);
    ploma.beginStroke(point.x, point.y, point.p);
    // Parallels.Audio.player.play('fx-cinq-drop');

    // disabled - need to make sure performance is snappy first
    // template.firstNode.style.cursor = 'none';
  };

  // extend the stroke at the mouse move point
  canvas.onmousemove = function (event) {
    if (!isDrawing) return;
    var point = getEventPoint(event, template, plugin);
    ploma.extendStroke(point.x, point.y, point.p);
  };

  // end the stroke at the mouse up point
  canvas.onmouseup = function (event) {
    isDrawing = false;
    var point = getEventPoint(event, template, plugin);
    ploma.endStroke(point.x, point.y, point.p);
  };

  template.firstNode.style.cursor = 'crosshair';
}

Template.sketchBit.onRendered(function () {
  console.log("bit:sketch:render");

  var template = this;
  var bit = this.data;
  canvas = $(template.firstNode).find(".sketch-bit")[0];
  plugin = document.getElementById('wtPlugin'); // NAPAPI, necessary for interfacing with Wacom tablet
  isDrawing = false;
  ploma = new Ploma(canvas);
  ploma.clear();
  var timeline = new TimelineMax();

  timeline.to(template.firstNode, 0, {x: bit.position.x, y: bit.position.y});

  if (isEditing(bit._id)) {
    console.log('editing this sketch');
    beginEditing(template);
  }

  // save a reference to the plomaCanvas to the template instance
  // as a property, so we can later access it and pull it down ,
  // stop the handlers, when no longer in use
  ploma.setStrokes(bit.content);

  Draggable.create(template.firstNode, {

    throwProps:false,
    zIndexBoost:false,

    onDragStart:function(){
      Parallels.Audio.player.play('fx-cinq-drop');
    },

    onPress: function(){
      timeline.to(template.firstNode, 0.20, { scale: 1.05, boxShadow: "rgba(0, 0, 0, 0.2) 0 16px 32px 0", ease: Expo.easeOut });
    },

    onRelease: function(){
      timeline.to(template.firstNode, 0.1, { scale: 1, boxShadow: "0", ease: Expo.easeOut });
    },

    onDragEnd:function() {
      var x = this.endX;
      var y = this.endY;

      Meteor.call('changeState', {
        command: 'updateBitPosition',
        data: {
          canvasId: '1',
          _id: bit._id,
          position: { x: x, y: y }
        }
      });

      Parallels.Audio.player.play('tone--aalto-dubtechno-mod-' + _.random(4, 8));
      timeline.to(template.firstNode, 0.1, { scale: 1, boxShadow: "0", ease: Expo.easeOut });
      return true;
    }
  });

  // TODO: into a 'sketch-mode'
  // Parallels.AppModes['bit-sketch'].enter();


  // draw the canvas from data, if available

  // bind sketch key handlers

  // Parallels.AppModes['bit-sketch'].enter()

  // for debugging - print the ploma instance arrays
  Mousetrap.bind('a', function () {
    console.log("pressed 'a' key");

    console.log("bit:sketch:getStrokes: ", ploma.getStrokes());
    console.log("bit:sketch:curStroke: ", ploma.curStroke());
  });

  // Mousetrap.bind('s', function (){
  //   console.log("pressed 's' key");

  //   var bitData = ploma.getStrokes();

  //   // save to Mongo
  // });

  Mousetrap.bind('mod+z', function () {
    console.log("pressed 'command/ctrl + z'");

    // remove the most recent stroke
    ploma.setStrokes(
      _.dropRight(
        ploma.getStrokes()
      )
    );

  });

  Mousetrap.bind('c', function () {
    console.log("pressed 'c' key");
    var bitHoveringId = Session.get('bitHoveringId');

    // TODO: only if hovering over a bit, once this is moved from map to
    // if (bitHoveringId) {
    console.log("clearing bit:sketch canvas on ", bitHoveringId);
    Parallels.Audio.player.play('fx-pep');
    ploma.clear();
    // TODO: bind clear to bit.content data reactively
    // }
  });

  Mousetrap.bind('up', function () {
    console.log("pressed 'up' key");
    event.preventDefault();

    Parallels.Audio.player.play('fx-pep');
    var opacity = Number(template.firstNode.style.opacity);
    console.log("bit:sketch:opacity = ", opacity);

    if (opacity < 1) {
      template.firstNode.style.opacity = (opacity + 0.10);
    }
    else {
      Parallels.Audio.player.play('fx-tri');
    }

  });

  Mousetrap.bind('down', function () {
    console.log("pressed 'down' key");
    event.preventDefault();

    Parallels.Audio.player.play('fx-pep');
    var opacity = Number(template.firstNode.style.opacity);
    console.log("bit:sketch:opacity = ", opacity);

    if (opacity > 0.10) {
      template.firstNode.style.opacity = (opacity - 0.10);
    }
    else {
      Parallels.Audio.player.play('fx-tri');
    }

  });
});
