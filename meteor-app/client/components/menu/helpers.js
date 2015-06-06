Template.menu.helpers({

  bitEditingId: function() {
    return Session.get('bitEditingId');
  },

  bitsCount: function() {
    return Bits.find().count();
  },

  isUploading: function () {
    return Session.get('uploading');
  },

  currentModeLabel: function () {
    if (Session.get('currentMode')){
      return 'in ' + Session.get('currentMode') + ' mode';
    }
  },

  currentModeShortcutTemplate: function () {
    return 'mode-shortcuts-' + ( Session.get('currentMode') || 'home' );
  },

  progress: function () {
    return Session.get('uploadProgress');
  }
});
