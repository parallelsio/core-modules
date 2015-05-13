Template.bit.onDestroyed(function(){
  Session.set('bitHoveringId', null);
});

Template.bit.onRendered(function (){

  var template = this;
  var bitDataContext = template.data;
  var bitDatabaseId = bitDataContext._id;
  var bitHtmlElement = Utilities.getBitHtmlElement(bitDatabaseId);
  log.debug("bit:render: ", bitDatabaseId);

  // Track upload status for new Bits
  Tracker.autorun(function (computation) {
    var bitUpload = Parallels.FileUploads[bitHtmlElement.data('upload-key')];
    if (!bitUpload) {
      computation.stop();
      return;
    }

    if (bitUpload.status() === 'failed') {
      //bitHtmlElement.find('.content')[0].classList.add('complete', 'error'); // would show a friendly error message but the next line we remove the bit so it isn't worth it. Should we figure out how to keep the Bit even if upload fails?
      computation.stop();
      Meteor.call('deleteBit', bitDatabaseId);
      return;
    }

    if (Math.round((bitUpload.progress() || 0) * 100) === 100) {
      bitHtmlElement.find('.content')[0].classList.add('complete', 'success');
      Bits.update( bitDatabaseId , {
        $set: { imageSource: bitUpload.instructions.download, uploadKey: null }
      });
      computation.stop();
    }
  });

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


