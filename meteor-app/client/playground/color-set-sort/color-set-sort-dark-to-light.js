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

    var vibrantColorsArray = _.sortBy(swatchArray, ['population']);

    _.each(vibrantColorsArray, function(value) {
      console.log(value.name, ": ", value.name);
    });

    // figure out the scale between the 2 endpoints that Vibrant returned
    // https://gka.github.io/palettes/#colors=lightgreen,tomato|steps=9|bez=1|coL=1
    // https://github.com/gka/chroma.js/wiki/Color-Scales
    // newest docs: https://gka.github.io/chroma.js/
    
    // option 1: use endpoints of vibrant to muted to make the scale
    var vibrantHexArray = _.map(swatchArray, 'hex');
    var scale = chroma.bezier(vibrantHexArray).scale();

    // option 2: use all the sampled colors vibrant found to make the scale
    // since vibrant returns a variable number of colors, by giving the endpoints to the chroma
    // function, it just fills in the rest later when we ask for a set number of color stops along the scale
    // var scale = chroma.bezier([ _.first(vibrantColorsArray).hex, _.last(vibrantColorsArray).hex ]).scale();

    return {
      vibrantColorsArray: vibrantColorsArray, // sorted by most used to least used (population)
      mostUsedColor: mostUsedColor,
      chromaColorsScale: scale
    }
  }



  // load an image and 
  var $bit = Utilities.getBitElement('peMXKjPoj3HADFHNo');
  var img = $bit.find('img').first()[0];

  // necessary for Vibrant to work because image is on :9000 and server is on :3000
  // probably can come out on production
  img.setAttribute('crossOrigin', 'anonymous');

  // make sure image is ready + loaded before trying to process
  img.addEventListener('load', function() {
    console.log('loaded image');

    var sample = sampleColors(img);
    console.log(sample);

     var $chromaColorsScale = $('<div>').addClass('bit--chroma-scale');
     var scaleColors = sample.chromaColorsScale.colors(10);

     _.each(scaleColors, function(value, key) {
      console.log('key: ', key);

      var $swatch = $('<div>', {
        // src: '//player.vimeo.com/video/' + vimeoId +'/?byline=1&portrait=0',
        class: 'bit--swatch' ,
        css: {
            backgroundColor: sample.chromaColorsScale(key * 0.1).hex()
        }
        // height: 40,
        // width: 40
      });

      console.log($swatch);

      $chromaColorsScale.prepend($swatch);
    });

    $('body').prepend($chromaColorsScale);
    // $('.some-div').replaceWith($swatch);


    // animate between colors in scale
    var granimInstance = new Granim({
      element: '.granim__canvas',
      name: 'basic-gradient',
      direction: 'diagonal',
      opacity: [1, 1],
      isPausedWhenNotInView: true,
      states : {
        "default-state": {
            gradients: [
                [ _.first(sample.vibrantColorsArray).hex , _.last(sample.vibrantColorsArray).hex ],
                [ _.last(sample.vibrantColorsArray).hex, _.first(sample.vibrantColorsArray).hex  ]
                // [ sample[3].hex , sample[4].hex ]

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
      
