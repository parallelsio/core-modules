Sound = {

  _folderPath: "sounds/",

  definition: {

    synthDef: {
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

  play: function(definition){

    if (Meteor.settings.public.options.isSoundEnabled) {
 
      "use strict";

      var enviro = flock.init();

      // The Impulse ugen's frequency controlled by a descending xLine.
      var synth = flock.synth(Sound.definition);
              
      enviro.play();
      
    }
  }




};
