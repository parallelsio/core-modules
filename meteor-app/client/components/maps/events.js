MeteorSettings.setDefaults({
  public: { options: { uploader: 'fileSystemUploader' } }
});

var eachFile = function(e, f) {
  var files = e.target.files;

  if (!files || files.length == 0)
    files = e.dataTransfer ? e.dataTransfer.files : [];

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
  'dropped .map': function(e) {
    var event = (e.originalEvent || e);

    eachFile(event, function (file, index) {
      var uploader = new Slingshot.Upload(Meteor.settings.public.options.uploader);
      uploader.send(file, function (error, downloadUrl) {
        if (error) { alert(error); }
        else {
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
        }
      });
    });
  }
});

Template.map.events(Parallels.Handlers.get('map.events'));
