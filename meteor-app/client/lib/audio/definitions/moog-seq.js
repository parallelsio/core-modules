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
            loop: 0,
            list: [
              teoria.note('g3').fq(),
              teoria.note('d3').fq(),
              teoria.note('c3').fq(),
              teoria.note('g3').fq(),
              ],
            options: {
                interpolation: "linear"
            }
        }
      },
      mul: 0.5
    } 
  }
}
              