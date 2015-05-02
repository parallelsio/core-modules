MeteorSettings.setDefaults({
  public: { options: { uploader: 'fileSystemUploader' } }
});

var eachFile = function(e, f) {
  var evt = (e.originalEvent || e);

  var files = evt.target.files;

  if (!files || files.length == 0)
    files = evt.dataTransfer ? evt.dataTransfer.files : [];

  for (var i = 0; i < files.length; i++) {
    f(files[i], i);
  }
};

Parallels.Handlers.register('map.events', {
  'dblclick .map': function (event) {
    console.log("bit:text:create");

    if(event.target.classList.contains('map')) {
      Parallels.AppModes['create-bit'].enter(event);
    }
  },
  'dropped .map': function(event) {
    eachFile(event, function (file, index) {
      console.log(file);
      Session.set('uploading', true);
      var uploader = new Slingshot.Upload(Meteor.settings.public.options.uploader);
      uploader.send(file, function (error, downloadUrl) {
        Session.set('uploading', false);
        if (error) {
          console.error('Error uploading', Parallels.Uploader.xhr.response);
          alert (error);
        }
        else {
          console.log('Success uploading', downloadUrl);
          var u = URL.createObjectURL(file);
          var img = new Image;

          img.onload = function() {
            var newBitAttributes = {
              type: "image",
              position: {
                x: 300 * index,
                y: 20
              },
              filename: downloadUrl,
              nativeWidth: img.width,
              nativeHeight: img.height
            };
            Meteor.call('insertBit', newBitAttributes, function (err) {
              console.log(err);
            });
          };

          img.src = u;
        }
      });
    });
  }
});

Template.map.events(Parallels.Handlers.get('map.events'));
