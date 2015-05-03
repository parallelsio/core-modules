/*

  OQ: How can we write tests for ensuring audio gets played?

  OQ: How can we trigger a callback, so for example, when impulseResponse def plays and gets
      down to the end point, frequency of 2, we can trigger an envelope to turn off sound output 
      untill next sound is triggered?

  OQ: What is the relationship between 'inputs' and 'source'? 
      
      Is it always:

        source: {
            inputs: {
              param1: value
              param2: value
            }
        }
      Or is it uGen specific?

  OQ: what does 'add' do? 'multiply'? they are used everywhere.

  OQ: what does 'value' mean in this context:
      https://github.com/colinbdclark/Flocking/blob/master/docs/ugens/triggers.md

  OQ: What modules dont we need based on current use?
  

*/ 


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
  // look at 'flocking-ugens.js' submodule.

  // This is an example of a ugen called 'dust', which makes a scratchy, noise sound.
  // It'll be defined in 'flocking-ugens.js' submodule like this:
  
  //    flock.ugen.dust = function (inputs, output, options) {
  //       ........ the math algorthim used to generate the sound .........
  //       .............. we dont touch any of this .......................
  //    }
  
  // Directly underneath each ugen definition in the 'flocking-ugens.js' submodule,
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


    /* Example:

        // The arbitrary name we made up for this definition
        twinSineDrones: {  
            
            // don't change the key name 'synthDef'           
            // Flocking depends on this exact spelling        
            synthDef:     { 

              // we use the 'id' key to lookup this definition,
              // when handling events in Meteor elsewhere.      
              // For readability, use the same name as 
              id: "twinSineDrones",

              ugen: "flock.ugen.xxxxxx",
              
              inputs: {
    
              },

              outputs: {
  
              },

              options: {
                callback: {
                  func: function () {
                    console.log("sound:definition: done.")
                    this._enviro.stop();
                  }
                }
              }
            }
        }
    */

    /* 
     *  Using an xLine ugen to curve down the frequency of an impulse.
     *  Send this as a source to a reverb effect.
     */
    impulseDrop: {  

      synthDef: {   

        id: "reverb",  
        ugen: "flock.ugen.freeverb",
        inputs: {
            source: {
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
            },
        
            mix: 0.93,
            room: 0.5,
            damp: 0.5
        },
      }

    }






    // // /*
    // //     Simple example of random audio noise, in a room of reverb
    // // */ 
    // duster: {  
    //   synthDef: {   

    //     id: "duster",  
    //     ugen: "flock.ugen.freeverb",
    //     inputs: {
    //         freq: {
    //           ugen: "flock.ugen.xLine",
    //           start: 880,
    //           end: 2,
    //           duration: 6.0
    //         },
    //         mul: 0.25
    //     },

    //     options: {
    //       callback: {
    //         func: function () {
    //           console.log("sound:definition: impulseDrop done.")
    //           this._enviro.stop();
    //         }
    //       }
    //     }
    //   }
    // }



  }

 
}







