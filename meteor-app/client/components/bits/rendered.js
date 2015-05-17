Template.bit.onRendered(function (){

  template = this;
  var bitDataContext = template.data;
  var bitDatabaseId = bitDataContext._id;
  var bitHtmlElement = Utilities.getBitHtmlElement(bitDatabaseId);
  console.log("bit:render: ", bitDatabaseId);

  var bitDragAudioInstance = "";

  function timelineDone(bitDatabaseId){
    console.log("bit:render. Move into position and keep hidden ", bitDatabaseId, " : timeline animate done");
  }

  var timeline = new TimelineMax({
    onComplete: timelineDone,
    onCompleteParams:[ bitDatabaseId  ]
  });

  // move to position, immediately hide
  timeline.to(bitHtmlElement, 0, { display: "none", alpha: 0, x: bitDataContext.position.x, y: bitDataContext.position.y })


  // // Needs to happen after position set, or else positions
  // // via manual transforms get overwritten by Draggable
  // // http://greensock.com/docs/#/HTML5/GSAP/Utils/Draggable
  Draggable.create(Template.instance().firstNode, {
    throwProps:false,
    zIndexBoost:false,

    onDragStart:function(event){
      var x = this.endX;
      var y = this.endY;

      // TODO: delay play so it's got time to 'breathe', and doesnt stutter ?
      // bitDragAudioInstance = Parallels.Audio.player.play('elasticStretch');
      // console.log(event.type, " : dragStart: ", x, " : ", y, " : ", this.getDirection("start"), " : ");
      
      Parallels.Audio.player.play('fx-cinq-drop');

    },

    // OQ: what's the diff between:
    // Draggable.addEventListener("onDrag", yourFunc);
    // and:
    onDrag:function(event){
      var x = this.endX;
      var y = this.endY;

      // TODO: only display if changed from last reading's value
      console.log(event.type, " : dragging: ", x, " : ", y, " : ", this.getDirection("start"), " : ", bitDragAudioInstance);

      // bitDragAudioInstance.set("elasticStretch.source.freq", x)
    },

    onDragEnd:function( event ) {
      console.log("done dragging.");

      var x = this.endX;
      var y = this.endY;

      var mongoId = this.target.dataset.id;
      console.log(event.type + ": " + mongoId + " : " + x + " : " + y);

      Bits.update( mongoId , {
        $set: {
          "position.x": x,
          "position.y": y
        }
      });

      Session.set("dragInstance", null);
      
      Parallels.Audio.player.play('fx-ffft');      
      

      // replace with envelope close instead:
      // it would be more performant, less slitch
      // and would be more like turning down the volume on the stereo,
      // rather than how we have it now, where were 
      // pressing the power button to turn off
      // Parallels.Audio.player.stop();
      return true;
    }
  });

});


