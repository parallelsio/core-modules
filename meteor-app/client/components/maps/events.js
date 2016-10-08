var getDroppedFiles = function(e) {
  var files = e.target.files;

  if (!files || files.length == 0)
    files = e.dataTransfer ? e.dataTransfer.files : [];

  return files;
};

var createImageBit = function (file, downloadUrl, event, uploadKey, index) {
  var u = URL.createObjectURL(file);
  var img = new Image;
  var xOffset = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
  var yOffset = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
  
  img.onload = function() {
    Meteor.call('changeState', {
      command: 'createBit',
      data: {
        canvasId: Session.get('canvasId'),
        type: "image",
        position: {
          x: (event.clientX + xOffset) + (30 * index),
          y: (event.clientY + yOffset) + (30 * index)
        },
        filename: file.name,
        uploadKey: uploadKey,
        imageSource: downloadUrl,
        nativeWidth: img.width,
        nativeHeight: img.height
      }
    });
  };

  img.src = u;
};


var initialWidth;
var initialHeight;

var openSelector = function(event) {
  var marqueeW = Math.abs(initialWidth - event.pageX);
  var marqueeH = Math.abs(initialHeight - event.pageY);
  // console.log("marqueeH:marqueeW: ", marqueeH, " : ", marqueeW);

  $(".marquee-select").css({
      'width': marqueeW,
      'height': marqueeH
  });

  if (event.pageX <= initialWidth && event.pageY >= initialHeight) {
    $(".marquee-select").css({
        'left': event.pageX
    });
  } 

  else if (event.pageY <= initialHeight && event.pageX >= initialWidth) {
    $(".marquee-select").css({
        'top': event.pageY
    });
  } 

  else if (event.pageY < initialHeight && event.pageX < initialWidth) {
    $(".marquee-select").css({
        'left': event.pageX,
        'top': event.pageY
    });
  }
};



function selectedBits(e) {

    Session.set("selectedBitsCount", 0);

    $(document).unbind("mousemove", openSelector);
    $(document).unbind("mouseup", selectedBits);

    var maxX = 0;
    var maxY = 0;


    // TODO: sync up with doc size?
    
    var minX = Session.get("mapHeight");
    var minY = Session.get("mapWidth");

    // TODO: Optimize. Do we need to iterate through all bits on canvas? 
    // or maybe just ones in viewport?
    $(".bit").each(function () {

      var $marquee = $(".marquee-select");
      var $checkingBit = $(this);
      var result = doObjectsCollide($marquee, $checkingBit);

      if (result) {
        count = Session.get("selectedBitsCount");
        Session.set("selectedBitsCount", count + 1 );

        var $marqueePos = $checkingBit.offset();
        var $checkingBitPos = $checkingBit.offset();
        var marqueeW = $checkingBit.width();
        var marqueeH = $checkingBit.height();
        var bitW = $checkingBit.width();
        var bitH = $checkingBit.height();

        var coords = checkMaxMinPos(
          $marqueePos, 
          $checkingBitPos, 
          marqueeW, 
          marqueeH, 
          bitW, 
          bitH, 
          maxX, 
          minX, 
          maxY, 
          minY
        );

        maxX = coords.maxX;
        minX = coords.minX;
        maxY = coords.maxY;
        minY = coords.minY;
        var parent = $checkingBit.parent();

        // console.log($marquee, $checkingBit,maxX, minX, maxY,minY);

        if ($checkingBit.css("left") === "auto" && $checkingBit.css("top") === "auto") {
            $checkingBit.css({
                'left': parent.css('left'),
                'top': parent.css('top')
            });
        }

        // add animated border to show what's selected
         $checkingBit.addClass('near');
        $(".cube").addClass("cube--show");

      }
  });
  
  $(".marquee-select").removeClass("marquee-active");
  $(".marquee-select").width(0).height(0);
}

// TODO: make this utility function
function doObjectsCollide(a, b) {
    
  var aTop = a.offset().top;
  var aLeft = a.offset().left;
  var bTop = b.offset().top;
  var bLeft = b.offset().left;

  return !(
      ((aTop + a.height()) < (bTop)) ||
      (aTop > (bTop + b.height())) ||
      ((aLeft + a.width()) < bLeft) ||
      (aLeft > (bLeft + b.width()))
  );
}  

// TODO: is this getClientRect?
function checkMaxMinPos(a, b, aW, aH, bW, bH, maxX, minX, maxY, minY) {
  'use strict';

  if (a.left < b.left) {
      if (a.left < minX) {
          minX = a.left;
      }
  } else {
      if (b.left < minX) {
          minX = b.left;
      }
  }

  if (a.left + aW > b.left + bW) {
      if (a.left > maxX) {
          maxX = a.left + aW;
      }
  } else {
      if (b.left + bW > maxX) {
          maxX = b.left + bW;
      }
  }
  ////////////////////////////////
  if (a.top < b.top) {
      if (a.top < minY) {
          minY = a.top;
      }
  } else {
      if (b.top < minY) {
          minY = b.top;
      }
  }

  if (a.top + aH > b.top + bH) {
      if (a.top > maxY) {
          maxY = a.top + aH;
      }
  } else {
      if (b.top + bH > maxY) {
          maxY = b.top + bH;
      }
  }

  return {
      'maxX': maxX,
      'minX': minX,
      'maxY': maxY,
      'minY': minY
  };
}



Template.map.events({

  'mousemove .map': function (event) {
    pointerPosition =  {
      x: event.pageX,
      y: event.pageY
    };
  },

  'dropped .map': function(e) {
    var event = (e.originalEvent || e);

    Session.set('uploadProgress', 0);
    Session.set('uploading', true);

    var droppedFiles = getDroppedFiles(event);

    var fileUploads = _.map(droppedFiles, function (file, index) {
      var uploadKey = Math.random().toString(36).slice(2);
      var slingshotUploader = new Slingshot.Upload(Session.get('PARALLELS_FILE_UPLOADER') || 'fileSystemUploader');
      slingshotUploader.send(file, function (error) {
        if (error) Parallels.log.debug({dateTimeStamp: Date.now(), action: 'Image Upload', message: error.message});
      });
      Parallels.FileUploads[uploadKey] = slingshotUploader;
      createImageBit(file, slingshotUploader.url(true), event, uploadKey, index);
      return slingshotUploader;
    });

    Tracker.autorun(function (computation) {
      var overallProgress = 0;

      fileUploads.forEach(function (fileUpload) {
        var fileUploadProgress = fileUpload.progress();
        fileUploadProgress = Math.round((fileUploadProgress || 0) * 100);
        overallProgress = overallProgress + fileUploadProgress;
      });

      overallProgress = overallProgress / droppedFiles.length;
      Session.set('uploadProgress', Math.round(overallProgress || 0));

      if (overallProgress === 100) {
        Session.set('uploading', false);
        computation.stop();
      }
    });
  },



  'mousedown .map': function (event) {

    Parallels.log.debug("keyCommand:startMarqueeSelection");

    // adapted from http://nightlycoding.com/index.php/2014/02/click-and-drag-multi-selection-rectangle-with-javascript/
    // https://codepen.io/netgfx/pen/twAfG

    // clear selections from the last time person selected things
    $('.near').removeClass('near');

    // TODO: stagger/glimmer animate
    $(".marquee-select").addClass("marquee-active");
    $(".cube").removeClass("cube--show");

    // TODO: refactor to use CSS transforms vs top/left for better rendering performance?
    $(".marquee-select").css({
        'left': event.pageX,
        'top': event.pageY
    });

    initialWidth = event.pageX;
    initialHeight = event.pageY;

    $(document).bind("mouseup", selectedBits);
    $(document).bind("mousemove", openSelector);
  },


  'dblclick .map': function (event) {

    Parallels.log.debug("keyCommand:createBitViaMapDbleClick");

    Meteor.call('changeState', {
      command: 'createBit',
      data: {
        canvasId: Session.get('canvasId'),
        type: 'text',
        content: '',
        width: '150',
        height: '50',
        color: 'white',
        position: pointerPosition
      }
    }, function (err, bit) {
      if (!err) {
        Session.set('textBitEditingId', bit._id);
      }
    });
  }

});
