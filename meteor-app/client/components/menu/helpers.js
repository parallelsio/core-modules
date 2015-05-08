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

  progress: function () {
    return Session.get('uploadProgress');
  }
});
