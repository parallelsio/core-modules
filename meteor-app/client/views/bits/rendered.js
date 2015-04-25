Template.bit.onCreated(function (){
  
  template = this;
  var bitDataContext = template.data;
  var bitDatabaseId = bitDataContext._id;
  var bitHtmlElement = Utilities.getBitHtmlElement(bitDatabaseId);
  console.log("bit:created: ", bitDatabaseId);

});

Template.bit.onRendered(function (){

  template = this;
  var bitDataContext = template.data;
  var bitDatabaseId = bitDataContext._id;
  var bitHtmlElement = Utilities.getBitHtmlElement(bitDatabaseId);
  console.log("bit:render: ", bitDatabaseId);

  function timelineDone(bitDatabaseId){
    console.log("bit:render. Move into position and keep hidden ", bitDatabaseId, " : timeline animate done");
  }

  var timeline = new TimelineMax({ 
    onComplete: timelineDone, 
    onCompleteParams:[ bitDatabaseId  ]
  });

  // move to position, immediately hide
  timeline.to(bitHtmlElement, 0, { display: "none", alpha: 0, x: bitDataContext.position_x, y: bitDataContext.position_y })


  // // Needs to happen after position set, or else positions 
  // // via manual transforms get overwritten by Draggable
  // // http://greensock.com/docs/#/HTML5/GSAP/Utils/Draggable
  Draggable.create(Template.instance().firstNode, {
    throwProps:false,
    zIndexBoost:false,
    
    // onDragStart:function(event){

    // },

    onDragEnd:function( event ) {
      console.log("done dragging.");

      var x = this.endX;
      var y = this.endY;

      var mongoId = this.target.dataset.id;
      console.log(event.type + ": " + mongoId + " : " + x + " : " + y);
      
      Bits.update( mongoId , {
        $set: {
          "position_x": x,
          "position_y": y
        }
      });
      
      Sound.play('glue.mp3');

      return true;
    }
  });

});  


