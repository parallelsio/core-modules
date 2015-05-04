/* 
 *  Using an xLine ugen to curve down the frequency of an impulse.
 *  Send this as a source to a reverb effect.


 *  OQ: How can we trigger a callback, so for example, when impulseResponse def plays and gets
 *      down to the end point, frequency of 2, we can trigger an envelope to turn off sound output 
 *      untill next sound is triggered?

 */

Parallels.Sound.Definition['impulseDrop'] = {

  synthDef: {   

    ugen: "flock.ugen.freeverb",
    inputs: {
      source: {
          ugen: "flock.ugen.impulse",
          inputs: {
              freq: {
                id: "impulseDropxLine",
                ugen: "flock.ugen.xLine",
                start: 880,
                end: 2,
                duration: 3.0
              },
              mul: 0.5
          },
      },

      mix: 0.93,
      room: 0.5,
      damp: 0.5
    }
  }
}
