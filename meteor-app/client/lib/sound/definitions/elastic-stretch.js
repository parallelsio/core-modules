/* 
 *  
 *  OQ: How do we synthesize a stretchy sound, based on param input of drag on Create-parallel?

 */

Parallels.Sound.Definition.ElasticStretch = {

  synthDef: {   

    id: "reverb",  
    ugen: "flock.ugen.freeverb",
    inputs: {
      source: {
          ugen: "flock.ugen.xxxxx",
          inputs: {
              
          },
      },

      mix: 0.93,
      room: 0.5,
      damp: 0.5
    },
  }
}
