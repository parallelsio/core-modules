import chroma from 'chroma-js';
import Granim from 'granim';
import _ from 'lodash';

// cant figure out how to load vibrant via import, using vendored minified js file

wireColorExplore = function wireColorExplore(){

  // sample the image for light + dark contast colors

  // figure out the scale, using the 2 endpoints
  // https://gka.github.io/palettes/#colors=lightgreen,tomato|steps=9|bez=1|coL=1
  // https://github.com/gka/chroma.js/wiki/Color-Scales
  // newest docs: https://gka.github.io/chroma.js/
  var scale = chroma.scale(['lightyellow', 'navy']).domain([0, 1], 5);
  var colorMostUsed;

  // load an image and 
    // var img = $('.bit.image img').first()[0];
    var $bit = Utilities.getBitElement('S3cBvZX7KL5MjoDnZ');
    var img = $bit.find('img').first()[0];

    // necessary for Vibrant to work because image is on :9000 and server is on :3000
    // probably can come out on production
    img.setAttribute('crossOrigin', 'anonymous');

    // make sure image is ready + loaded before trying to process
    img.addEventListener('load', function() {
      console.log('loaded');

      var vibrant = new Vibrant(img);
      // console.log(img);
      // console.log(vibrant);

      var swatches = vibrant.swatches();
      var swatchArray = [];

      for (var swatch in swatches){
        if (swatches.hasOwnProperty(swatch) && swatches[swatch]){
          console.log(swatch, ": ", swatches[swatch].getHex(), ": ", swatches[swatch].population);
          swatchArray.push( { name: swatch, hex: swatches[swatch].getHex(), population: swatches[swatch].population })
        }
      }

      colorMostUsed = _.maxBy(swatchArray, 'population');
      console.log('img: ', img);

      var sortedSwatchArray = _.sortBy(swatchArray, ['population']);
      console.log("# colors:", sortedSwatchArray.size);

      _.each(sortedSwatchArray, function(value) {
        console.log(value.name, ": ", value.name);
      });

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
                    [ _.first(sortedSwatchArray).hex , _.last(sortedSwatchArray).hex ],
                    [ sortedSwatchArray[3].hex , sortedSwatchArray[4].hex ]
                    // [ scale(0).hex() , scale(1).hex() ]
                    //, [ scale(0.5).hex() , scale(0.75).hex() ]
                ],
                transitionSpeed: 1000,
                loop: true
            }
        }
      });




  });



};
      
