Template.bit.helpers({

  isEditingThisBit: function() {
    return Session.equals('bitEditingId', this._id);
  },

  imageSrc: function () {
    return this.imageDataUrl || this.imageSource;
  },

  uploadStatus: function () {
    var bitUpload = Parallels.FileUploads[this.uploadKey];
    if (this.uploadKey && bitUpload && Math.round((bitUpload.progress() || 0) * 100) != 100) {
      return 'processing';
    } else {
      return 'complete';
    }
  }
});
