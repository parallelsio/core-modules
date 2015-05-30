/*

  OQ: What Flocking.js modules dont we need based on current use?

  OQ: How can we write tests for ensuring audio gets played?

  TODO: standardize reverb times by making an effect bus;
        wire all synthDefs through it [vs wrapping each in a reverb individually]

*/

Parallels.Audio.player = {

  _enviro: false,
  _folderPath: "audio/",

  init: function(){
    "use strict"
    if (Meteor.settings.public.options.isAudioEnabled) {
      this._enviro = flock.init();
    } else {
      this._enviro = {
        play: function () {},
        pause: function () {},
        stop: function () {}
      }
    }
  },

  play: function(definition){
    console.log("audio:play: trigger", definition);
    var synth = flock.synth(Parallels.Audio.Definition[definition]);
    if (this._enviro) this._enviro.play();

    // we need a reference to this obj, so we can later change
    // the parameters of this synth, via the .set function
    // in realtime, based on person's actions
    return synth;
  },

  pause: function(definition){
    console.log("audio:pause");
    return this._enviro.pause();
  },

  stop: function(){
    console.log("audio:stop");
    return this._enviro.stop();
  }
}







