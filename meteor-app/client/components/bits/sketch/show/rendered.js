/*
 Ploma only does rendering
 doesnt care where location + pressure data come from
 Ploma can be used with any tablet

 SD/OQ:  - Any benefit of using Meteor template event map,
 versus doing it here?

 - Use a local collection to cache strokes to minimize
 delays/writes to db?

 */

// NAPAPI is necessary for interfacing with the Wacom tablet
var npApiPlugin;// We can re-use the same npApiPlugin instance for all sketch bits (which is why it's a "global").

function SketchBit($node, bit) {
  var self = this;
  _.extend(self, bit);
  self.$node = $node;
  self.canvas = self.$node.find('.sketch-bit')[0];
  self.ploma = new Ploma(self.canvas);
  self.ploma.setStrokes(self.content);
  self.drawingEnabled = false;
}

SketchBit.prototype.enableDrawing = function () {
  var self = this;
  var isStroke = false;
  self.drawingEnabled = true;
  self.$node.css('cursor', 'crosshair');

  // begin a stroke at the mouse down point
  self.canvas.onmousedown = function (event) {
    isStroke = true;
    var point = self.getEventPoint(event);
    self.ploma.beginStroke(point.x, point.y, point.p);
    // Parallels.Audio.player.play('fx-cinq-drop');

    // disabled - need to make sure performance is snappy first
    // template.firstNode.style.cursor = 'none';
  };

  // extend the stroke at the mouse move point
  self.canvas.onmousemove = function (event) {
    if (!isStroke) return;
    var point = self.getEventPoint(event);
    self.ploma.extendStroke(point.x, point.y, point.p);
  };

  // end the stroke at the mouse up point
  self.canvas.onmouseup = function (event) {
    isStroke = false;
    var point = self.getEventPoint(event);
    self.ploma.endStroke(point.x, point.y, point.p);
  };
};

SketchBit.prototype.disableDrawing = function () {
  var self = this;
  self.canvas.onmousedown = self.canvas.onmousemove = self.canvas.onmouseup = null;
  self.drawingEnabled = false;
};

SketchBit.prototype.getEventPoint = function (event) {
  var self = this;
  var point = {};

  // recalc mouse coordinates, accounting for combination of 2 things:
  // 1) where the bit sits, offset from 0,0 via the template instance
  // 2) if person is scrolled away from default viewport, via the Window object
  // use verge lib for cross-browser compatibility
  point.x = (verge.scrollX() + event.clientX) - self.$node.position().left;
  point.y = (verge.scrollY() + event.clientY) - self.$node.position().top;

  // fail gracefully if no pressure is detected (no tablet found)
  // tablet reports a range of 0 to 1
  point.p = npApiPlugin.penAPI && npApiPlugin.penAPI.pressure ? npApiPlugin.penAPI.pressure : 0.6;
  return point;
};

SketchBit.prototype.isFocused = function () {
  var self = this;
  var currentlyEditingId = Session.get('bitEditingId');
  return currentlyEditingId && currentlyEditingId === self._id;
};

Template.sketchBit.onRendered(function () {
  console.log("bit:sketch:render");

  if (!npApiPlugin) {
    npApiPlugin = document.getElementById('wtPlugin');
  }

  var template = this;
  var sketchBit = new SketchBit($(template.firstNode), this.data);

  // Move the bit into position
  var timeline = new TimelineMax();
  timeline.to(template.firstNode, 0, {x: sketchBit.position.x, y: sketchBit.position.y});

  var draggable = Draggable.create(template.firstNode, {

    throwProps: false,
    zIndexBoost: false,

    onDragStart: function () {
      Parallels.Audio.player.play('fx-cinq-drop');
    },

    onPress: function () {
      timeline.to(template.firstNode, 0.20, {
        scale: 1.05,
        boxShadow: "rgba(0, 0, 0, 0.2) 0 16px 32px 0",
        ease: Expo.easeOut
      });
    },

    onRelease: function () {
      timeline.to(template.firstNode, 0.1, {scale: 1, boxShadow: "0", ease: Expo.easeOut});
    },

    onDragEnd: function () {
      var x = this.endX;
      var y = this.endY;

      Meteor.call('changeState', {
        command: 'updateBitPosition',
        data: {
          canvasId: '1',
          _id: sketchBit._id,
          position: {x: x, y: y}
        }
      });

      Parallels.Audio.player.play('tone--aalto-dubtechno-mod-' + _.random(4, 8));
      timeline.to(template.firstNode, 0.1, {scale: 1, boxShadow: "0", ease: Expo.easeOut});
      return true;
    }
  });

  Tracker.autorun(function () {
    if (sketchBit.isFocused() && !sketchBit.drawingEnabled) {
      draggable[0].disable();
      sketchBit.enableDrawing();
    } else {
      draggable[0].enable();
      sketchBit.disableDrawing();
    }
  });

  var mousetrap = new Mousetrap(template.firstNode);

  mousetrap.bind('c', function () {
    console.log('hit c on sketch ID: ' + sketchBit._id);
  });

  mousetrap.bind('e', function () {
    //Session.set
  });
});

Template.sketchBit.onDestroyed(function () {
  console.log("bit:sketch:destroy");
  Session.set('bitHoveringId', null);
  //Parallels.Keys.bindUndo();
  //Mousetrap(this.firstNode).unbind('a');
  //Mousetrap(this.firstNode).unbind('mod+z');
  //Mousetrap(this.firstNode).unbind('c');
  //Mousetrap(this.firstNode).unbind('up');
  //Mousetrap(this.firstNode).unbind('down');
});
