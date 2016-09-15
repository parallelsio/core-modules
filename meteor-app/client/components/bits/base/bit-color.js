import chroma from 'chroma-js';
import Granim from 'granim';
import _ from 'lodash';
// cant figure out how to load vibrant via import, using vendored minified js file

classifyColors = function classifyColors(template){

  var $bitElement = $(template.firstNode);
  var chromaNumStops = 10;
  
  function sampleColors(img){
    var vibSwatchesArray = [];
    var vibrant = new Vibrant(img);

    // sample the image for key colors
    var swatches = vibrant.swatches();

    for (var swatch in swatches){
      // some swatches have 0 population, skip them
      if (swatches.hasOwnProperty(swatch) && swatches[swatch] && swatches[swatch].population){
        console.log(swatch, ": ", swatches[swatch].getHex(), ": ", swatches[swatch].population);
        vibSwatchesArray.push( { 
          name: swatch, 
          hex: swatches[swatch].getHex(), 
          population: swatches[swatch].population
        })
      }
    }

    // transform the vibrant population given, into a range between 0 and 1
    // so we can later make predictably sized visualizations of color proportions  
    // save each new population within range as a new property into each swatch

    // TODO: adjust for small % if less than 5%, show as 5% so it's visible
    _.each(vibSwatchesArray, function(value, key) {

       var options = {
        oldNumber: value.population, 
        oldMin: _.minBy(vibSwatchesArray, 'population').population, // most used 
        oldMax: _.maxBy(vibSwatchesArray, 'population').population, // least used color
        newMin: 0, 
        newMax: 1
      }

      value.scaledPopulation = Utilities.scaleNumberToRange(options);
      console.log("value.scaledPopulation: ", value.scaledPopulation);
    });

    var vibSortedSwatches = _.sortBy(vibSwatchesArray, ['population']);

    // use Chroma.js to create a color scale with the sampled colors
    // https://gka.github.io/palettes/#colors=lightgreen,tomato|steps=9|bez=1|coL=1
    // https://github.com/gka/chroma.js/wiki/Color-Scales
    // newest docs: https://gka.github.io/chroma.js/

    // option 1: use 2 colors from Vibrant samples, as endpoints for our scale
    // Chroma will interpolate the rest in between
    // var scale = chroma.bezier([ _.first(vibSortedSwatches).hex, _.last(vibSortedSwatches).hex ]).scale();

    // option 2: use all the sampled colors vibrant gave us to make the scale
    // since vibrant returns a variable number of colors, we pass the full array and let Chroma figure out how
    // to make/interpolate them in a nice order (?)
    var vibHexArray = _.map(vibSortedSwatches, 'hex');
    var scale = chroma.bezier(vibHexArray).scale();


    // TODO: make vibrant props their own object
    return {
      vibSortedSwatches: vibSortedSwatches, // sorted by most used to least used (population)
      vibHexArray: vibHexArray,
      chromaScale: scale
    }
  }

  // load an image and 
  var img = $bitElement.find('img').first()[0];

  // necessary for Vibrant to work because image is on :9000 and server is on :3000
  // probably can come out on production
  // TODO: not working reliably. only every 3rd refresh? 
  img.setAttribute('crossOrigin', 'anonymous');

  // make sure image is ready + loaded before trying to process
  img.addEventListener('load', function() {
    // console.log('loaded image');

    var sample = sampleColors(img);
    console.log(sample);

    //////////////////////
    //////////////////////
    /// make and insert the chroma scale into the DOM
    var $chromaScale = $('<div>').addClass('scale--chroma');
    var scaleColors = sample.chromaScale.colors(chromaNumStops);

     _.each(scaleColors, function(value, key) {

      var $swatch = $('<div>', {
        // src: 
        class: 'swatch--chroma' ,
        css: {
            backgroundColor: sample.chromaScale(key *  (1/chromaNumStops) ).hex()
        }
      });

      $chromaScale.prepend($swatch);
    });

    $bitElement.prepend($chromaScale);

    //////////////////////
    //////////////////////
    /// make and insert the vibrant scale into the DOM
    var $vibrantScale = $('<div>').addClass('scale--vibrant');

    _.each(sample.vibSortedSwatches, function(value, key) {

      var colorPercent = _.toString(_.round(value.scaledPopulation, 2) * 100);
      var $swatch = $('<div>', {
        class: 'swatch--vibrant vibrant--' + value.name ,
        css: {
            backgroundColor: value.hex,
            text: value.name + ':' + value.population
        },
        // figure the % this color represents from the total
        // then make the width of this box 
        // TODO: adjust for small %
        width: colorPercent
      });
      
      $swatch.text(value.name, ':', colorPercent);
      $vibrantScale.prepend($swatch);
    });

    $bitElement.prepend($vibrantScale);

  });

};

// TODO: check for image being loaded, and sample being processed before running this 
// one thing we can do is move the classifying to when the image is uploaded, and store values in db 
displayGradientAnimation = function displayGradientAnimation(template, sample){

  var $bitElement = $(template.firstNode);
  var $gradientCanvas = $('<canvas>').addClass('granim__canvas');
  $bitElement.prepend($gradientCanvas);

  // animate between colors in scale
  var granimInstance = new Granim({
    element: $gradientCanvas,
    name: 'basic-gradient',
    direction: 'diagonal',
    opacity: [1, 1],
    isPausedWhenNotInView: true,
    states : {
      "default-state": {
          gradients: [
              [ _.first(sample.vibSortedSwatches).hex , _.last(sample.vibSortedSwatches).hex ],
              [ _.last(sample.vibSortedSwatches).hex, _.first(sample.vibSortedSwatches).hex  ]
              // [ sample[3].hex , sample[4].hex ]

              // [ scale(0).hex() , scale(1).hex() ]
              //, [ scale(0.5).hex() , scale(0.75).hex() ]
          ],
          transitionSpeed: 3000,
          loop: false
      }
    }
  });

}

