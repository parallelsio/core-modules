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

  currentMode: function () {
    if (Session.get('currentMode')){
      return 'in ' + Session.get('currentMode') + ' mode';
    }
  },

  progress: function () {
    return Session.get('uploadProgress');
  }
});
