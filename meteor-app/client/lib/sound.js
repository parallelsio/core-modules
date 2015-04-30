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
    this._enviro.play();
    return synth;
  },

  stopAllNow: function(){
    // TODO: Stub
    return false;
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

    loudSound: {
    /******************************************/
      synthDef: {
        ugen: "flock.ugen.playBuffer",
        buffer: {
          url: "glue.mp3" // TODO: update this, not sure if it can play mp3s. 
        },
        trigger: {
          ugen: "flock.ugen.mouse.click",
          options: {
            target: ".bit"
          }
        }
      }
    }
  }
}