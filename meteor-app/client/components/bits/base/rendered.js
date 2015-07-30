Template.bit.onRendered(function (){

  var template = this;
  var bit = template.data;
  var bitDatabaseId = bit._id;
  var $bitElement = $(template.firstNode);
  var $content = $bitElement.find('.content');
  var $uiWidgetHeader = $(template.find('.ui-widget-header'));

  $content.css("height", bit.height);
  $content.css("width", bit.width);
  $content.resizable({
    handles: {
      se: '.ui-resizable-se',
      e: '.ui-resizable-e',
      s: '.ui-resizable-s'
    },
    stop: function (event, $resizable) {
      var $editbitElement = $(template.find('.editbit'));
      Meteor.call('changeState', {
        command: 'updateBitContent',
        data: {
          canvasId: Session.get('canvasId'),
          _id: bit._id,
          content: $editbitElement.html(),
          height: $resizable.size.height,
          width: $resizable.size.width
        }
      });
    }
  });

  makeBitDraggable($bitElement, $uiWidgetHeader);


  // When a Bit position is updated during a concurrent session (by someone else)
  // move the bit to it's new position on all other sessions/clients
  Tracker.autorun(function() {
    var bit = Bits.findOne(bitDatabaseId);
    if (bit) {
      var timeline = new TimelineMax();
      timeline.to($bitElement, 0, { x: bit.position.x, y: bit.position.y });
    }
  });

  // Track upload status for new Bits
  Tracker.autorun(function (computation) {
    var bitUpload = Parallels.FileUploads[$bitElement.data('upload-key')];
    if (!bitUpload) {
      computation.stop();
      return;
    }

    if (bitUpload.status() === 'failed') {
      /*
        AB: OQ: would show a friendly error message but the next line we remove the bit
        so it isn't worth it. Should we figure out how to keep the Bit even if upload fails?
        $bitElement.find('.content')[0].classList.add('complete', 'error');
      */
      computation.stop();
      Meteor.call('changeState', {
        command: 'deleteBit',
        data: {
          canvasId: Session.get('canvasId'),
          _id: bitDatabaseId
        }
      });
      return;
    }

    if (bitUpload.status() === 'done') {
      $bitElement.find('.upload-status').addClass('complete success')
      Meteor.call('changeState', {
        command: 'uploadImage',
        data: {
          canvasId: Session.get('canvasId'),
          _id: bitDatabaseId,
          imageSource: bitUpload.instructions.download,
          uploadKey: null
        }
      });
      computation.stop();
    }
  });

  // Set a default image so we don't see a broken image in case the file can't be loaded
  $bitElement.find(".bit-image").error(function(){
    $(this).attr('src', 'http://placehold.it/850x650&text=' + bit.filename);
  });


});


