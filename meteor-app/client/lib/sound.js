Sound = {

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


  // Each sound in our app is defined below as a JSON object.
  // The Flocking.js lib convention is to refer to them as Definitions
  // Definitions are one big config file that instructs Flocking.js
  // how to dynamically synthesize (generate) the sound

  // Each definition uses 1 or more uGen's, a unit generator.
  // Think of a ugen as a sound emitter that produces a particular 
  // type of tone or sound. There are thousands of uGens, and each have their own
  // input + output paramters, and particular options.
  // uGens can be combined with a definition, like Lego, to make complex sounds 

  // To see what inputs/outputs/options are available for each uGen, 
  // look at `flocking-ugens.js` submodule.

  // This is an example of a ugen called `dust`, which makes a scratchy, noise sound.
  // It'll be defined in `flocking-ugens.js` submodule like this:
  
  //    flock.ugen.dust = function (inputs, output, options) {
  //       ........ the math algorthim used to generate the sound .........
  //       .............. we dont touch any of this .......................
  //    }
  
  // Directly underneath each ugen definition in the `flocking-ugens.js` submodule,
  // are the defaults for that uGen. These give us clues how to use/control it:

  //    fluid.defaults("flock.ugen.dust", {
  //        inputs: {
  //            density: 1.0,   // first input parameter: How dense should this be, from 0 to 1
  //            mul: 2,         // 2nd input parameter: a multiplier increases the volume
  //            add: null       // 3rd input parameter: etc
  //        },
  //        ugenOptions: {
  //            model: {
  //               density: 0.0,        // 1st option to shape the sound
  //               scale: 0.0,          // 2nd option ...
  //               threshold: 0.0,      // 3rd option ...
  //               unscaledValue: 0.0,  // 4th option ...
  //               value: 0.0           // 5th option ...
  //            }
  //         }
  //     });
   
  // These inputs/outputs/options are what we declare below in each synthDefinition
  // to override the defaults for the uGens we use.
  // We then control these parameters in real time via user input
  // and other data related to Parallels around our Meteor app

     
  definitions: {

    /* 
     *
     */
    impulseDrop: {  // The arbitrary name of this definition

          synthDef: {   // <-- don't change `synthDef`: Flocking depends on this exact spelling 

            // we use the `id` key to lookup this definition when handling events: 
            // https://github.com/colinbdclark/Flocking/blob/master/docs/responding-to-user-input.md 
            id: "impulseDrop",  
            ugen: "flock.ugen.impulse",
            inputs: {
                freq: {
                  ugen: "flock.ugen.xLine",
                  start: 880,
                  end: 2,
                  duration: 6.0
                },
                mul: 0.25
            },

            options: {
              callback: {
                func: function () {
                  console.log("sound:definition: impulseDrop done.")
                  this._enviro.stop();
                }
              }
            }
          }
    },

    /*
        Simple example of random audio noise, in a room of reverb
    */ 
 //    duster: {  
 //      synthDef: {   

 //        id: "duster",  
 //        ugen: "flock.ugen.freeverb",
 //        inputs: {
 //            freq: {
 //              ugen: "flock.ugen.xLine",
 //              start: 880,
 //              end: 2,
 //              duration: 6.0
 //            },
 //            mul: 0.25
 //        },

 //        options: {
 //          callback: {
 //            func: function () {
 //              console.log("sound:definition: impulseDrop done.")
 //              this._enviro.stop();
 //            }
 //          }
 //        }
 //      }
 //    },

 //    // ***********************
 //    duster: {
 //      synthDef: {
 //        id: "duster",

 //        inputs: {
 //          source: {
 //            ugen: "flock.ugen.dust",
 //            density: 200,
 //            mul: 0.25
 //          },
 //        }

 //        options: {
 //          mix: 0.7,
 //          room: 0.25,
 //          damp: 1  
 //        }
 //      }       
 //    }
 //    // ***********************



 // synthDef: {
 //      ugen: "flock.ugen.out",
      
 //        inputs: {
 //           sources: [
 //            {
 //              ugen: "flock.ugen.sinOsc"
 //            },
 //            {
 //              ugen: "flock.ugen.sinOsc",
 //              freq: 444
 //            }
 //          ] 
 //      } 
        
   
 //    }

  }

 
}







