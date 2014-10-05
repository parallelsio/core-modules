var soundFx = {

  _folderPath: "sounds/",

  playSound: function(soundFileName){
    if (isSoundOn) {
      var sound = new Howl({
        urls: [folderPath + soundFileName]
      }).play();
    }
  }


};


