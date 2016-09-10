import chroma from 'chroma-js';
import Granim from 'granim';

wireColorExplore = function wireColorExplore(){

  // sample the image for light + dark contast colors

  // figure out the scale, using the 2 endpoints
  // https://gka.github.io/palettes/#colors=lightgreen,tomato|steps=9|bez=1|coL=1
  // https://github.com/gka/chroma.js/wiki/Color-Scales
  var scale = chroma.scale(['lightyellow', 'navy']).domain([0, 1], 5);
    
  // animate between the scale
  var granimInstance = new Granim({
    element: '.granim__canvas',
    name: 'basic-gradient',
    direction: 'diagonal',
    opacity: [1, 1],
    isPausedWhenNotInView: true,
    states : {
        "default-state": {
            gradients: [
                [ scale(0).hex() , scale(1).hex() ]
                //, [ scale(0.5).hex() , scale(0.75).hex() ]
            ],
            transitionSpeed: 5000,
            loop: false
        }
    }
  });


}
