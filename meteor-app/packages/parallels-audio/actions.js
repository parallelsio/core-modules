/*

  OQ: How can we write tests for ensuring audio gets played?

*/

Parallels.Audio.player = {

  _folderPath: "sounds/",

  play: function(soundFileName){
    log.debug("audio:play: trigger: ", soundFileName);
    new Howl({ urls: [ this._folderPath + soundFileName] }).play();
  }
}