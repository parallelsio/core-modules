var
  $bit,
  bitTemplate,
  bitData,
  bitPreviewingId,
  bitHoveringId;

Parallels.AppModes['preview-bit'] = {

  enter: function () {
    console.log("mode:preview-bit:enter");

    bitHoveringId = Session.get('bitHoveringId');
    $bit = Utilities.getBitElement(bitHoveringId);
    bitTemplate = Utilities.getBitTemplate(bitHoveringId);
    bitData = Blaze.getData(bitTemplate);

    // TODO: disable bitHover too

    // only supporting image preview currently
    // webpage is currently represented on canvas as an image
    if ((bitData.type === "image") || (bitData.type === "webpage")){
      bitPreviewingId = bitHoveringId;
      Session.set('currentMode', 'preview-bit');
      Session.set('bitPreviewingId', bitPreviewingId);

      console.log("bit:image:preview: " + bitPreviewingId);

      Parallels.Keys.unbindActions();

      var options = {
        bitData: bitData,
        $bit: $bit,
        bitTemplate: bitTemplate,
        direction: "expand"
      };

      Parallels.Animation.Image.morph(options);
    }

    else {
      console.log("bit:preview: is not an image. Do nothing." );
    }
  },

  exit: function () {
    console.log("mode:preview-bit:exit");

    // refactor: get rid of dep on these vars.
    var bitPreviewingId = Session.get('bitPreviewingId');
    $bit = Utilities.getBitElement(bitPreviewingId);
    var bitTemplate = Utilities.getBitTemplate(bitPreviewingId);
    var bitData = Blaze.getData(bitTemplate);

    if (bitPreviewingId)
    {
      // TODO: pass the assignment/resetting of these
      // into Animation.scale,
      // which will then reset it once the animation complete callback is triggered
      // this will avoid potential edge cases where person takes
      // action in between animations
      Session.set('currentMode', null);
      Session.set('bitPreviewingId', null);

      var options = {
        bitData: bitData,
        $bit: $bit,
        bitTemplate: bitTemplate,
        direction: "contract"
      };

      Parallels.Animation.Image.morph(options);

      Parallels.Keys.bindActions();
    }

    else {
      console.log("nothing to close: not previewing a bit");
    }
  }
};
