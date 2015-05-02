Sound = {

  _enviro: false,
  _folderPath: "sounds/",

  // this._folderPath + soundFileName

  init: function(){
    "use strict"
    if (Meteor.settings.public.options.isSoundEnabled) {
      this._enviro = flock.init();
    }
  },

  play: function(definition){
    console.log("sound:play: trigger", definition);
    var synth = flock.synth(definition);
    return this._enviro.play();
  },

  pause: function(definition){
    console.log("sound:pause");
    return this._enviro.pause();
  },

  stop: function(){
    console.log("sound:stop");
    return this._enviro.stop();
  },


  // Each sound in our app is defined below as a definition object.
  // Definitions are just JSON data, which the Flocking JS lib
  // uses to dynamically synthesize (create) the sound

  // The "synthDef" key in every definition object is required, 
  // as Flocking lib expects this on its .play() function: do not change.

  definitions: {
   
    impulseDrop: {  // name of this definition
    /******************************************/

      // The Impulse ugen's frequency controlled by a descending xLine
      synthDef: {  // do not change this label, 
        id: "impulseDrop",
        ugen: "flock.ugen.impulse",
        freq: {
          ugen: "flock.ugen.xLine",
          start: 880,
          end: 2,
          duration: 6.0
        },
        mul: 0.25,
        options: {
          callback: {
            func: function () {
              console.log("sound:definition: impulseDrop done.")
            }
          }
        }
      }
    },

    synthDef: {
      id: "duster",
      // Simple example of random audio noise, in a room of reverb
      ugen: "flock.ugen.freeverb",
      source: {
          ugen: "flock.ugen.dust",
          density: 200,
          mul: 0.25
      },
      mix: 0.7,
      room: 0.25,
      damp: 1
    }  
  }
}