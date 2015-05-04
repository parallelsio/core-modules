Template.map.helpers({
  bits: function() {
    return Bits.find();
  },
  isUploading: function () {
    return Session.get('uploading');
  }
});

Template.progressBar.helpers({
  progress: function () {
    return Session.get('uploadProgress');
  }
});
