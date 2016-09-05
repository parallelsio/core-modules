var maxRenderPixels = {
  height: 200,
  width: 200
}

Template.bit.helpers({

  isTextBit: function() {
    return this.type === "text";
  },

  isImageBit: function() {
    return this.type === "image";
  },

  isWebBit: function() {
    return this.type === "webpage";
  },

  // TODO: should probably put this somewhere when saving the file vs here
  pixelHeight: function() {
    return Utilities.calcAspectRatioFit(this.nativeWidth, this.nativeHeight, maxRenderPixels.width, maxRenderPixels.height).height;
  },

  pixelWidth: function() {
    return Utilities.calcAspectRatioFit(this.nativeWidth, this.nativeHeight, maxRenderPixels.width, maxRenderPixels.height).width;
  },

  imageSrc: function () {
    return this.imageDataUrl || this.imageSource;
  },

  isImageTypeGif: function (){
    if (this.filename.toUpperCase().split('.').pop() === 'GIF') {
      return true;
    }
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
  },

  // TODO: rendering contenteditbable from inside a helper due to the following outstanding meteor issues:
  // https://github.com/meteor/meteor/issues/2980
  // https://github.com/meteor/meteor/issues/1964
  // https://github.com/meteor/meteor/issues/3635
  // possible alternative workaround: https://github.com/eluck/contenteditable/commit/b406d83863341c376f21f7de5056fdc8d4100877
  editor: function () {
    return '<div class="bit--editing" contenteditable="false">' + this.content + '</div>';
  }
});
