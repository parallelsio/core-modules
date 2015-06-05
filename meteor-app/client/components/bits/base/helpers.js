Template.bit.helpers({

  isEditingTextBit: function() {
    return Session.equals('bitEditingId', this._id);
  },

  isSketchBit: function() {
    return this.type === "sketch";
  },

  isTextBit: function() {
    return this.type === "text";
  },

  imageSrc: function () {
    return this.imageDataUrl || this.imageSource;
  },

  uploadProgress: function () {
    var bitUpload = Parallels.FileUploads[this.uploadKey];
    return bitUpload ? Math.round((bitUpload.progress() || 0) * 100) : 100;
  },

  uploadStatus: function () {
    var bitUpload = Parallels.FileUploads[this.uploadKey];
    if (this.uploadKey && bitUpload && bitUpload.status() != 'done') {
      return 'processing';
    } else {
      return 'complete';
    }
  }
});