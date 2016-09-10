import chroma from 'chroma-js';
import Granim from 'granim';
import Vibrant from 'vibrant';

wireColorExplore = function wireColorExplore(){

  // sample the image for light + dark contast colors

  // figure out the scale, using the 2 endpoints
  // https://gka.github.io/palettes/#colors=lightgreen,tomato|steps=9|bez=1|coL=1
  // https://github.com/gka/chroma.js/wiki/Color-Scales
  // newest docs: https://gka.github.io/chroma.js/
  var scale = chroma.scale(['lightyellow', 'navy']).domain([0, 1], 5);
    
  // animate between the scale
  // var granimInstance = new Granim({
  //   element: '.granim__canvas',
  //   name: 'basic-gradient',
  //   direction: 'diagonal',
  //   opacity: [1, 1],
  //   isPausedWhenNotInView: true,
  //   states : {
  //       "default-state": {
  //           gradients: [
  //               [ scale(0).hex() , scale(1).hex() ]
  //               //, [ scale(0.5).hex() , scale(0.75).hex() ]
  //           ],
  //           transitionSpeed: 5000,
  //           loop: false
  //       }
  //   }
  // });


  var $img = Utilities.getBitElement('S3cBvZX7KL5MjoDnZ');
  var img = $img.find('img')[0];

  img.addEventListener('load', function() {
      console.log('loaded');
      var vibrant = new Vibrant(img);
      var swatches = vibrant.swatches()
      for (var swatch in swatches)
          if (swatches.hasOwnProperty(swatch) && swatches[swatch])
              console.log(swatch, swatches[swatch].getHex())

      /*
       * Results into:
       * Vibrant #7a4426
       * Muted #7b9eae
       * DarkVibrant #348945
       * DarkMuted #141414
       * LightVibrant #f3ccb4
       */
  })
};
      
