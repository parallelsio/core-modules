
Parallels.Audio.Definition['moogSeq'] = {

  synthDef: {   

    id: "moogSeq",  
    ugen: "flock.ugen.filter.moog",
      cutoff: {
      ugen: "flock.ugen.lfSaw",
      freq:1000,
      mul: 500,
      add: 7000,
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
            list: [
              teoria.note('g3').fq(),
              teoria.note('d3').fq(),
              teoria.note('c3').fq(),
              teoria.note('g3').fq(),
              teoria.note('g4').fq(),
              teoria.note('b3').fq(),
              teoria.note('a1').fq(),
              teoria.note('g2').fq(),
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
              