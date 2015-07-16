Template.bit.helpers({

  isEditingTextBit: function() {
    return Session.equals('bitEditingId', this._id);
  },

  isTextBit: function() {
    return this.type === "text";
  },

  contentOrPlaceholder: function () {
    var hasContent = this.content && this.content.length > 0;
    return hasContent ? this.content : '[enter text]';
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
