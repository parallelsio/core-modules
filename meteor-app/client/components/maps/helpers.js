Template.map.helpers({
  bits: function() {
    return Bits.find();
  },
  isUploading: function () {
    //return Session.get('uploading');
    return false;
  }
});

Template.progressBar.helpers({
  progress: function () {
    return '';
    //return Math.round((Parallels.Uploader.progress() || 0) * 100);
  }
});
