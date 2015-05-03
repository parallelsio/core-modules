MeteorSettings.setDefaults({
  public: { options: { uploader: 'fileSystemUploader' } }
});

var getDroppedFiles = function(e) {
  var files = e.target.files;

  if (!files || files.length == 0)
    files = e.dataTransfer ? e.dataTransfer.files : [];

  return files;
};

var createImageBit = function (file, downloadUrl, event, index) {
  var u = URL.createObjectURL(file);
  var img = new Image;
  img.onload = function() {
    var newBitAttributes = {
      type: "image",
      position: {
        x: event.clientX + (30 * index),
        y: event.clientY
      },
      filename: downloadUrl,
      nativeWidth: img.width,
      nativeHeight: img.height
    };
    Meteor.call('insertBit', newBitAttributes, function (err) {
      if (err) alert(err);
    });
  };
  img.src = u;
};

Parallels.Handlers.register('map.events', {

  'dblclick .map': function (event) {
    console.log("bit:text:create");

    if(event.target.classList.contains('map')) {
      Parallels.AppModes['create-bit'].enter(event);
    }
  },

  'dropped .map': function(e) {
    var event = (e.originalEvent || e);

    Session.set('uploadProgress', 0);
    Session.set('uploading', true);

    var droppedFiles = getDroppedFiles(event);

    var fileUploads = _.map(droppedFiles, function (file, index) {
      var uploader = new Slingshot.Upload(Meteor.settings.public.options.uploader);
      uploader.send(file, function (error, downloadUrl) {
        if (error) { alert(error); }
        else {
          createImageBit(file, downloadUrl, event, index);
        }
      });
      return uploader;
    });

    Tracker.autorun(function (computation) {
      var overallProgress = 0;

      fileUploads.forEach(function (fileUpload) {
        var fileUploadProgress = fileUpload.progress();
        fileUploadProgress = Math.round((fileUploadProgress || 0) * 100);
        overallProgress = overallProgress + fileUploadProgress;
      });

      overallProgress = overallProgress / droppedFiles.length;
      Session.set('uploadProgress', Math.round(overallProgress || 0));

      if (overallProgress === 100) {
        Session.set('uploading', false);
        computation.stop();
      }
    });
  }
});

Template.map.events(Parallels.Handlers.get('map.events'));
