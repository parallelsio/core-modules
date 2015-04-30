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
    eachFile(event, function (file) {
      console.log('uploading file: ', file);
    });
  }
});

Template.map.events(Parallels.Handlers.get('map.events'));
