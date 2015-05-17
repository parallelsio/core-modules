Parallels.AppModes['preview-bit'] = {
  enter: function () {
    Session.set('currentMode', 'preview-bit');
    console.log("mode:preview-bit:enter");

    var bitHoveringId = Session.get('bitHoveringId');
    var bitPreviewingId = Session.get('bitPreviewingId');

    if (bitHoveringId)
    {
      console.log("pressed spacebar over bit: ", bitHoveringId);

      var $bit = $("[data-id='" + bitHoveringId + "']");
      var bitTemplate = Blaze.getView($bit[0]);
      var bitData = Blaze.getData(bitTemplate);

      // currently, we're only supporting preview for images, so use
      // the bit type as the determining factor, if we should expand it
      if ((bitData.type === "image") || (bitData.type === "webpage")){
        console.log("bit:image:preview: " + bitHoveringId);

        // now, let's see if it needs to be expanded, or closed:
        if (bitPreviewingId === null) {
          // nothing is being previewed currently, expand the image
          Transform.scaleImage(bitData, bitHoveringId, $bit, bitTemplate, "expand");
        }

        else {
          // bit is being previewed, close/restore to thumbnail size
          Transform.scaleImage(bitData, bitHoveringId, $bit, bitTemplate, "contract");
        }
      }

      else {
        console.log("bit:preview:", bitHoveringId, " is not an image. Do nothing." );
      }
    }

    else {
      console.log ('space key ignored, not captured for a specific bit')
    }
  },
  exit: function () {
    Session.set('currentMode', null);
    console.log("mode:preview-bit:exit");

    var bitEditingId = Session.get('bitEditingId');
    var bitPreviewingId = Session.get('bitPreviewingId');

    if (bitEditingId)
    {
      Meteor.call('removeBit', bitEditingId);
      Session.set('bitEditingId', null);
    }
  }
};
