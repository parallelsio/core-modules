Parallels.AppModes['edit-text-bit'] = {


  enter: function ($bitElement, template) {

    Parallels.log.debug("mode:edit-text-bit:enter");

    // handle both pathways into this function:
    // A: person hovers over a bit, presses key command  
    // B: person double clicks the bit

    // if (template){
    //   var $bitElement = $(template.firstNode);
    //   Session.set('textBitEditingId', template.data._id);
    // }

    // else {
    //   var $bitElement = Utilities.getBitElement(Session.get('bitHoveringId'));
    //   Session.set('textBitEditingId', Session.set('bitHoveringId'));
    // }

    //   Session.set('currentMode', null);

    var $content = $bitElement.find('.bit__content');
    var $editingElement = $bitElement.find('.bit--editing');

    $editingElement.attr('contenteditable', 'true');
    $content.resizable( "enable" );

    $bitElement.addClass('bit--selected');
    $bitElement.find('.bit__resize').show();
    Draggable.get( $bitElement ).disable();
    $editingElement.focus();

    Parallels.Audio.player.play('fx-temp-temp-subtle');

    Parallels.Keys.unbindActions();

  },

  exit: function ($bitElement, template) {
    Parallels.log.debug("mode:edit-text-bit:exit");

    var $content = $bitElement.find('.bit__content');
    var $editingElement = $bitElement.find('.bit--editing');
    //   Session.set('currentMode', null);

    $editingElement.attr('contenteditable', 'false')
    $content.resizable( "disable" );

    $bitElement.removeClass('bit--selected');
    $bitElement.find('.bit__resize').hide();
    Draggable.get( $bitElement ).enable();
    Session.set('textBitEditingId', null);
    $editingElement.blur();

    if ($content != $editingElement.html()) {
      Meteor.call('changeState', {
        command: 'updateBitContent',
        data: {
          canvasId: Session.get('canvasId'),
          _id: this._id,
          content: $editingElement.html(),
          height: $content.height(),
          width: $content.width()
        }
      });

      Parallels.Audio.player.play('fx-cha-ching');
    }

    Parallels.Keys.bindActions();
  }
};
