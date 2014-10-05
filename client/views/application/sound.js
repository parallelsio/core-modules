sound = {

  _folderPath: "sounds/",

  play: function(soundFileName){

    if (Meteor.settings.public.options.isSoundEnabled) {
      var sound = new Howl({
        urls: [ this._folderPath + soundFileName ]
      }).play();
    }

  }


};
