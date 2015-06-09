Parallels.Audio.Definition['moogSeq'] = {

  synthDef: {   

    id: "moogSeq",  
    ugen: "flock.ugen.filter.moog",
      cutoff: {
      ugen: "flock.ugen.lfSaw",
      freq:10,
      mul: 300,
      add: 2000,
    },
    resonance: {
      ugen: "flock.ugen.sin",
      freq:1/2,
      width:.25,
      mul: 0.5,
      add: 0.5
    },
    inputs: {
      source: {
        ugen:"flock.ugen.saw",
        freq: {
            ugen: "flock.ugen.sequence",
            freq: 2,
            loop: 1,
            list: [220, 220 * 5/4, 220, 220 * 3/2, 220 * 4/3, 220*3/2, 220*2, 220*4/3, 220*5/4, 220*3/4, 220, 220*7/8, 256],
            options: {
                interpolation: "linear"
            }
        }
      },
      mul: 0.5
    } 
  }
}
              