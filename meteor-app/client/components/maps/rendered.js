Template.map.onRendered(function (){
  
  Parallels.Audio.player.play('fx-welcome-v1');

  var mapTemplate = this;
  var container = mapTemplate.find('.map');

  // ***************** PLOMA *************************
  var isDrawing = false;
  var canvas = $("#sketch-bit")[0];

  // canvas is any <canvas> element
  var ploma = new Ploma(canvas);
  ploma.clear();

  // begin a stroke at the mouse down point
  canvas.onmousedown = function(e) {
    isDrawing = true;
    ploma.beginStroke(e.clientX, e.clientY, 1);
  }

  // extend the stroke at the mouse move point
  canvas.onmousemove = function(e) {
    if (!isDrawing) return;
    ploma.extendStroke(e.clientX, e.clientY, 1);
  }

  // end the stroke at the mouse up point
  canvas.onmouseup = function(e) {
    isDrawing = false;
    ploma.endStroke(e.clientX, e.clientY, 1);
  }

  // ***************** PLOMA *************************


  container._uihooks = {

    insertElement: function(node, next) {

      var bitDataContext = Blaze.getData(node); // get child data context (bit)
      var bitDatabaseId = bitDataContext._id;

      // TODO: use Greensock's force3D flag, instead of 0.01px hack [which triggers GPU rendering]
      var transformString =  "translate3d(" + bitDataContext.position.x + "px, " + bitDataContext.position.y + "px, 0.01px)";
      log.debug('_uihook: moment before bit insert: ', bitDatabaseId);

      $(node)
        .hide()
        .insertBefore(next)
        .css( { transform: transformString } )

        // TODO: add conditional to the editbit focus, as only relevant for text bits

        function timelineInsertDone(node){
          log.debug("bit:insert:uihook timeline animate done.");
        }

        var timelineInsert = new TimelineMax({
          onComplete: timelineInsertDone,
          onCompleteParams:[ node ]
        });

        timelineInsert
          .to(node, 0, { x: bitDataContext.position.x, y: bitDataContext.position.y })
          .to(node, 0.125, { ease:Bounce.easeIn , display:'block', opacity: 0, alpha: 0 })
          .to(node, 0.125, { scale: 0.95, ease:Quint.easeOut , opacity: 1, alpha: 1} )
          .to(node, 0.275, { scale: 1, ease:Elastic.easeOut } );
    },


    removeElement: function(node) {

      function timelineRemoveDone(node){
        $(node).remove();
        log.debug("bit:remove:uihook : timeline animate done. removed bit.");
      }

      var timelineRemove = new TimelineMax({
        onComplete: timelineRemoveDone,
        onCompleteParams:[ node ]
      });

      timelineRemove.to(node, 0.10, { opacity: 0, ease:Expo.easeIn, display: 'none' });
    }
  };

});




