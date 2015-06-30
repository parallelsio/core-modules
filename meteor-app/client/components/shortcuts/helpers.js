Template.shortcuts.helpers({
  
 currentModeLabel: function () {
    if (Session.get('currentMode')){
      return 'in ' + Session.get('currentMode') + ' mode';
    }
  },

  currentModeShortcutTemplate: function () {
    return 'mode-shortcuts-' + ( Session.get('currentMode') || 'home' );
  }

});