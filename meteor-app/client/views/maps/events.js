Parallels.Handlers.register('map.events', {
  'dblclick .map': function (event) {
    console.log("bit:text:create");

    if(event.target.classList.contains('map')) {
      Parallels.AppModes['create-bit'].enter(event);
    }
  }
});

Template.map.events(Parallels.Handlers.get('map.events'));
