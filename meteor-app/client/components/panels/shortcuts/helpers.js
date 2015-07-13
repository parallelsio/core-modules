Template.shortcuts.helpers({
  
  currentModeShortcutTemplate: function () {
    return 'mode-shortcuts-' + ( Session.get('currentMode') || 'home' );
  }

});