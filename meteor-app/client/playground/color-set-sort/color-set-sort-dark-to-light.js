import chroma from 'chroma-js';
import Granim from 'granim';
import _ from 'lodash';
// cant figure out how to load vibrant via import, using vendored minified js file


wireColorExplore = function wireColorExplore(){



  function sampleColors(img){
    var swatchArray = [];
    var vibrant = new Vibrant(img);

    // sample the image for key colors
    var swatches = vibrant.swatches();

    for (var swatch in swatches){
      if (swatches.hasOwnProperty(swatch) && swatches[swatch]){
        console.log(swatch, ": ", swatches[swatch].getHex(), ": ", swatches[swatch].population);
        swatchArray.push( { name: swatch, hex: swatches[swatch].getHex(), population: swatches[swatch].population })
      }
    }

    var mostUsedColor = _.maxBy(swatchArray, 'population');

    var sortedSwatchArray = _.sortBy(swatchArray, ['population']);
    // console.log("# colors:", sortedSwatchArray.length);

    _.each(sortedSwatchArray, function(value) {
      console.log(value.name, ": ", value.name);
    });

    // figure out the scale between the 2 endpoints
    // https://gka.github.io/palettes/#colors=lightgreen,tomato|steps=9|bez=1|coL=1
    // https://github.com/gka/chroma.js/wiki/Color-Scales
    // newest docs: https://gka.github.io/chroma.js/
    var scale = chroma.scale([_.first(sortedSwatchArray), _.last(sortedSwatchArray)]).domain([0, 1], 10);

    return {
      sortedSwatchArray: sortedSwatchArray, // sorted by most used to least used (population)
      mostUsedColor: mostUsedColor,
      scale: scale
    }
  }



  // load an image and 
  // var img = $('.bit.image img').first()[0];
  var $bit = Utilities.getBitElement('S3cBvZX7KL5MjoDnZ');
  var img = $bit.find('img').first()[0];

  // necessary for Vibrant to work because image is on :9000 and server is on :3000
  // probably can come out on production
  img.setAttribute('crossOrigin', 'anonymous');

  // make sure image is ready + loaded before trying to process
  img.addEventListener('load', function() {
    console.log('loaded image: S3cBvZX7KL5MjoDnZ');

    var colors = sampleColors(img);
    console.log(colors);

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
                [ _.first(colors.sortedSwatchArray).hex , _.last(colors.sortedSwatchArray).hex ],
                [ _.last(colors.sortedSwatchArray).hex, _.first(colors.sortedSwatchArray).hex  ]
                // [ colors[3].hex , colors[4].hex ]

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
      
