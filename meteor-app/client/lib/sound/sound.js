/*
  
  OQ: What Flocking.js modules dont we need based on current use? 

  OQ: How can we write tests for ensuring audio gets played?

  TODO: standardize reverb times by making an effect bus; 
        wire all synthDefs through it [vs wrapping each in a reverb individually]

*/ 

Parallels.Sound.player = {

  _enviro: false,
  _folderPath: "sounds/",

  init: function(){
    "use strict"
    if (Meteor.settings.public.options.isSoundEnabled) {
      this._enviro = flock.init();
    }
  },

  play: function(definition){
    console.log("sound:play: trigger", definition);
    var synth = flock.synth(Parallels.Sound.Definition[definition]);
    return this._enviro.play();
  },

  pause: function(definition){
    console.log("sound:pause");
    return this._enviro.pause();
  },

  stop: function(){
    console.log("sound:stop");
    return this._enviro.stop();
  }
}







