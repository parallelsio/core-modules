Parallels.AppModes['edit-text-bit'] = {


  enter: function ($bitElement, template) {

    Parallels.log.debug("mode:edit-text-bit:enter");

    //   Session.set('currentMode', null);
    Draggable.get( $bitElement ).disable(); // needs to happen before the resizeable is set, or else resizable wont work

    var $content = $bitElement.find('.bit__content');
    var $editingElement = $bitElement.find('.bit--editing');

    $editingElement.attr('contenteditable', 'true');

    $content.resizable({
      handles: { se: '.ui-resizable-se' },

      stop: function (event, $resizable) {
        // getting weird behavior when trying to resize, 
        // as this Session var remain 'stuck'. 
        // Clear it as a hackfix
        Session.set('mousedown', null);

        Meteor.call('changeState', {
          command: 'updateBitContent',
          data: {
            canvasId: Session.get('canvasId'),
            _id: template.data._id,
            content: $editingElement.html(),
            height: $resizable.size.height,
            width: $resizable.size.width
          }
        });
      }
    });

    $bitElement.addClass('bit--selected');
    $bitElement.find('.bit__resize').show();
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

    if (template.data.content != $editingElement.html()) {
      Meteor.call('changeState', {
        command: 'updateBitContent',
        data: {
          canvasId: Session.get('canvasId'),
          _id: template.data._id,
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
