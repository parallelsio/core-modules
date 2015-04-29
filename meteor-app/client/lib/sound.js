Sound = {

  play: function(definition){

    if (Meteor.settings.public.options.isSoundEnabled) {
      "use strict";

      var enviro = flock.init();
      var synth = flock.synth(Sound.definition.impulseDrop);
              
      enviro.play();
    }
  },

  stop: function(){
    // kill all sound immediately.
    return false;
  },



  // Each sound in our app is defined below as a definition object.
  // Definitions are just JSON data, which the Flocking JS lib
  // uses to dynamically synthesize (create) the sound

  // The "synthDef" key in every definition object is required, 
  // as Flocking lib expects this on its .play() function: do not change.

  definition: {
   
    impulseDrop: {  // name of this definition
    /******************************************/

      // The Impulse ugen's frequency controlled by a descending xLine
      synthDef: {  // do not change this label, 
        ugen: "flock.ugen.impulse",
        freq: {
            ugen: "flock.ugen.xLine",
            start: 880,
            end: 2,
            duration: 4.0
        },
        mul: 0.25
      }
    },

    // be careful with this one! turn down the volume!
    highHat: {
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