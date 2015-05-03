Template.bit.onRendered(function (){

  template = this;
  var bitDataContext = template.data;
  var bitDatabaseId = bitDataContext._id;
  var bitHtmlElement = Utilities.getBitHtmlElement(bitDatabaseId);
  log.debug("bit:render: ", bitDatabaseId);

  function timelineDone(bitDatabaseId){
    log.debug("bit:render. Move into position and keep hidden ", bitDatabaseId, " : timeline animate done");
    log.debug(bitHtmlElement);
  }

  var timeline = new TimelineMax({
    onComplete: timelineDone,
    onCompleteParams:[ bitDatabaseId  ]
  });

  // move to position, immediately hide
  timeline.to(bitHtmlElement, 0, { alpha: 0, x: bitDataContext.position.x, y: bitDataContext.position.y });


  // // Needs to happen after position set, or else positions
  // // via manual transforms get overwritten by Draggable
  // // http://greensock.com/docs/#/HTML5/GSAP/Utils/Draggable
  Draggable.create(Template.instance().firstNode, {
    throwProps:false,
    zIndexBoost:false,

    onDragEnd:function( event ) {
      log.debug("done dragging.");

      var x = this.endX;
      var y = this.endY;

      var mongoId = this.target.dataset.id;
      log.debug(event.type + ": " + mongoId + " : " + x + " : " + y);

      Bits.update( mongoId , {
        $set: {
          "position.x": x,
          "position.y": y
        }
      });

      Sound.play('glue.mp3');

      return true;
    }
  });

});


