Template.bit.onRendered(function (){

  var template = this;
  var bitDataContext = template.data;
  var bitDatabaseId = bitDataContext._id;
  var bitElement = Utilities.getBitElement(bitDatabaseId);
  console.log("bit:render: ", bitDatabaseId);

  // When a Bit position is updated during a concurrent session (by someone else)
  // move the bit to it's new position on all other sessions/clients
  Tracker.autorun(function() {
    var bit = Bits.findOne(bitDatabaseId);
    if (bit) {
      var timeline = new TimelineMax();
      timeline.to(bitElement, 0, { x: bit.position.x, y: bit.position.y });
    }
  });

  // Track upload status for new Bits
  Tracker.autorun(function (computation) {
    var bitUpload = Parallels.FileUploads[bitElement.data('upload-key')];
    if (!bitUpload) {
      computation.stop();
      return;
    }

    if (bitUpload.status() === 'failed') {
      /*
        AB: OQ: would show a friendly error message but the next line we remove the bit
        so it isn't worth it. Should we figure out how to keep the Bit even if upload fails?
        bitElement.find('.content')[0].classList.add('complete', 'error');
      */
      computation.stop();
      Meteor.call('changeState', {
        command: 'deleteBit',
        data: {
          canvasId: '1',
          _id: bitDatabaseId
        }
      });
      return;
    }

    if (bitUpload.status() === 'done') {
      bitElement.find('.upload-status')[0].classList.add('complete', 'success');
      Meteor.call('changeState', {
        command: 'uploadImage',
        data: {
          canvasId: '1',
          _id: bitDatabaseId,
          imageSource: bitUpload.instructions.download,
          uploadKey: null
        }
      });
      computation.stop();
    }
  });

  // Set a default image so we don't see a broken image in case the file can't be loaded
  bitElement.find(".bit-image").error(function(){
    $(this).attr('src', 'http://placehold.it/850x650&text=' + bitDataContext.filename);
  });

  var bitDragAudioInstance = "";

  var resetBitSize = function(message){
    function timelineDone(bitDatabaseId){
      console.log(message, bitDatabaseId);
    }

    var timeline = new TimelineMax({
      onComplete: timelineDone,
      onCompleteParams:[ bitDatabaseId  ]
    });

    timeline.to(bitElement, 0.1, { scale: 1, boxShadow: "0", ease: Expo.easeOut });
  };

  // // Needs to happen after position set, or else positions
  // // via manual transforms get overwritten by Draggable
  // // http://greensock.com/docs/#/HTML5/GSAP/Utils/Draggable
  Draggable.create(template.firstNode, {

    // TODO: unbind keys

    throwProps:false,
    zIndexBoost:false,

    onDragStart:function(event){
      // console.log("bit:drag:onDragStart", bitDatabaseId);

      var x = this.endX;
      var y = this.endY;

      // TODO: delay play so it's got time to 'breathe', and doesnt stutter ?
      // bitDragAudioInstance = Parallels.Audio.player.play('elasticStretch');
      // console.log(event.type, " : dragStart: ", x, " : ", y, " : ", this.getDirection("start"), " : ");

      Parallels.Audio.player.play('fx-cinq-drop');
    },

    onPress: function(event){
      function timelineDone(bitDatabaseId){
        // console.log("bit:drag:onPress", bitDatabaseId);
      }

      var timeline = new TimelineMax({
        onComplete: timelineDone,
        onCompleteParams:[ bitDatabaseId  ]
      });

      // TODO: improve performance
      // use image asset instead of CSS shadow:
      // https://stackoverflow.com/questions/16504281/css3-box-shadow-inset-painful-performance-killer

      // TODO: ensure this happens only when in Draggable and mouse is held down
      // and not on regular taps/clicks of bit
      timeline.to(bitElement, 0.20, { scale: 1.05, boxShadow: "rgba(0, 0, 0, 0.2) 0 16px 32px 0", ease: Expo.easeOut });
    },

    onRelease: function(event){
      // console.log("bit:drag:onrelease", bitDatabaseId);
      resetBitSize("bit:drag:onRelease: animation end");
    },

    onDrag:function(event){
      var x = this.endX;
      var y = this.endY;

      // TODO: only display if changed from last reading's value
      // console.log("bit:drag:onDrag: ", event.type, " : ", x, " : ", y, " : ", this.getDirection("start"), " : ", bitDragAudioInstance);

      // bitDragAudioInstance.set("elasticStretch.source.freq", x)

    },

    onDragEnd:function( event ) {
      // console.log("bit:drag:onDragEnd", bitDatabaseId);


      var x = this.endX;
      var y = this.endY;

      var mongoId = this.target.dataset.id;
      // console.log(event.type + ": " + mongoId + " : " + x + " : " + y);

      Meteor.call('changeState', {
        command: 'updateBitPosition',
        data: {
          canvasId: '1',
          _id: mongoId,
          position: { x: x, y: y }
        }
      });

      Session.set("dragInstance", null);

      // Parallels.Audio.player.play('fx-ffft');

      // a random tone, in the mid-range of the scale
      Parallels.Audio.player.play('tone--aalto-dubtechno-mod-' + _.random(4, 8));

      function timelineDone(bitDatabaseId){
        console.log("bit:drag:end", bitDatabaseId);
      }

      var timeline = new TimelineMax({
        onComplete: timelineDone,
        onCompleteParams:[ bitDatabaseId  ]
      });

      timeline.to(bitElement, 0.1, { scale: 1, boxShadow: "0", ease: Expo.easeOut });

      resetBitSize("bit:drag:onDragEnd, animation end");

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


