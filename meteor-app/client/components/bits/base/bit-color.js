import chroma from 'chroma-js';
import Granim from 'granim';
import _ from 'lodash';
import nameThisColor from 'name-this-color';

// depends on vibrant.js, vendored. TODO: refactor via import



/////////////////////

// end up with something like: http://mkweb.bcgsc.ca/color-summarizer/?examples
classifyColors = function classifyColors($bitElement){

  var chromaNumStops = 10;

  // load an image  
  var imgElement = $bitElement.find('img').first()[0];

  // necessary for Vibrant to work because image is on :9000 and server is on :3000
  // probably can come out on production
  // TODO: not working reliably. only every 3rd refresh? 
  // imgElement.setAttribute('crossOrigin', 'anonymous');
  imgElement.crossOrigin = 'anonymous';

  var sample = sampleColorsWithVibrant(imgElement);
  // var sample = sampleColorsWithKMeans(imgElement);


  
  // TODO: Currently broken because of browser content policy, intermittently + and unreliably working.
  // Also, results are not great: washed out colors, because Vibrant.js quantizes colors before sampling
  // K-means method gives better colors, re: perception. 
  // Vibrant has useful population function though, which lets us show the ratio of colors.
  function sampleColorsWithVibrant(imgElement){
    var vibSwatchesArray = [];
    var vibrant;

    try {
      vibrant = new Vibrant(imgElement);
    } 

    catch (e) {
      console.log("Tainted canvas exception: aborting: ", e);
      return;
    }

    // sample the image for key colors
    var swatches = vibrant.swatches();
    var populationSum = 0;

    for (var swatch in swatches){
      // some swatches have 0 population, skip them
      if (swatches.hasOwnProperty(swatch) && swatches[swatch]){
        // Parallels.log.debug(swatch, ": ", swatches[swatch].getHex(), ": ", swatches[swatch].population);
        populationSum = populationSum + swatches[swatch].population;
        vibSwatchesArray.push( { 
          name: swatch, 
          hex: swatches[swatch].getHex(), 
          population: swatches[swatch].population
        })
      }

      // console.log(swatches[swatch].getHex());
    }

    // transform the vibrant population given, into a range between 0 and 1
    // so we can later make predictably sized visualizations of color proportions  
    // save each new population within range as a new property into each swatch

    // TODO: adjust for small % if less than 5%, show as 5% so it's visible
    _.each(vibSwatchesArray, function(value, key) {

       var options = {
        oldNumber: value.population, 
        oldMin: 0,               
        oldMax: populationSum, 
        newMin: 0, 
        newMax: 1
      }

      value.scaledPopulation = Utilities.scaleNumberToRange(options);
      // Parallels.log.debug("value.scaledPopulation: ", value.scaledPopulation);
    });

    var vibSortedSwatches = _.sortBy(vibSwatchesArray, ['population']);

    // use Chroma.js to create a color scale with the sampled colors
    // https://gka.github.io/palettes/#colors=lightgreen,tomato|steps=9|bez=1|coL=1
    // https://github.com/gka/chroma.js/wiki/Color-Scales
    // newest docs: https://gka.github.io/chroma.js/

    // option 1: use first + last from Vibrant sampled colors as endpoints for our scale
    // Chroma will interpolate the rest in between
    // var scale = chroma.bezier([ _.first(vibSortedSwatches).hex, _.last(vibSortedSwatches).hex ]).scale();

    // option 2: use all the sampled colors vibrant gave us to make the scale
    // since vibrant returns a variable number of colors, we pass the full array and let Chroma figure out how
    // to make/interpolate them in a nice order (?)
    var vibHexArray = _.map(vibSortedSwatches, 'hex');
    var scale = chroma.bezier(vibHexArray).scale();

    return {
      vibSortedSwatches: vibSortedSwatches, // sorted by most used to least used (population)
      vibHexArray: vibHexArray,
      chromaScale: scale
    }
  }

  // TODO: add population function
  function sampleColorsWithKMeans(imgElement){

    var $canvas = $('<canvas>')
      .css({
        width: 0,
        height: 0,
        position: 'absolute'
      })
      .attr('crossOrigin', 'anonymous');
      
    $bitElement.prepend($canvas);

    // using kmeans functions to sample images
    var ctx = $bitElement.find('canvas')[0].getContext('2d');
    var ctxImg = new Image();
    var scale;

      // TODO: remove in production
    ctxImg.setAttribute('crossOrigin', 'anonymous');
    ctxImg.src = imgElement.src;
    ctxImg.onload = function() {
      var kMeansColorsArray;

      // TODO: move this to async function
      // TODO: process a smaller version of the image
      kMeansColorsArray = processImage(ctxImg, ctx);
      scale = chroma.bezier(kMeansColorsArray).scale(); 
      console.log(scale);

      makeAndShowChromaScale();
    }

    // from http://charlesleifer.com/static/colors/
    // http://charlesleifer.com/blog/using-python-and-k-means-to-find-the-dominant-colors-in-images/
    // https://gist.github.com/loretoparisi/c147ca437ab9d5e163b7
    var kClusters = 3;

    function euclidean(p1, p2) {
      var s = 0;
      for (var i = 0, l = p1.length; i < l; i++) {
        s += Math.pow(p1[i] - p2[i], 2)
      }
      return Math.sqrt(s);
    }

    function calculateCenter(points, n) {
      var vals = []
        , plen = 0;
      for (var i = 0; i < n; i++) { vals.push(0); }
      for (var i = 0, l = points.length; i < l; i++) {
        plen++;
        for (var j = 0; j < n; j++) {
          vals[j] += points[i][j];
        }
      }
      for (var i = 0; i < n; i++) {
        vals[i] = vals[i] / plen;
      }
      return vals;
    }

    function kmeans(points, k, min_diff) {
      plen = points.length;
      clusters = [];
      seen = [];
      while (clusters.length < k) {
        idx = parseInt(Math.random() * plen);
        found = false;
        for (var i = 0; i < seen.length; i++ ) {
          if (idx === seen[i]) {
            found = true;
            break;
          }
        }
        if (!found) {
          seen.push(idx);
          clusters.push([points[idx], [points[idx]]]);
        }
      }

      while (true) {
        plists = [];
        for (var i = 0; i < k; i++) {
          plists.push([]);
        }

        for (var j = 0; j < plen; j++) {
          var p = points[j]
           , smallest_distance = 10000000
           , idx = 0;
          for (var i = 0; i < k; i++) {
            var distance = euclidean(p, clusters[i][0]);
            if (distance < smallest_distance) {
              smallest_distance = distance;
              idx = i;
            }
          }
          plists[idx].push(p);
        }

        var diff = 0;
        for (var i = 0; i < k; i++) {
          var old = clusters[i]
            , list = plists[i]
            , center = calculateCenter(plists[i], 3)
            , new_cluster = [center, (plists[i])]
            , dist = euclidean(old[0], center);
          clusters[i] = new_cluster
          diff = diff > dist ? diff : dist;
        }
        if (diff < min_diff) {
          break;
        }
      }
      return clusters;
    }

    function rgbToHex(rgb) {
      function th(i) {
        var h = parseInt(i).toString(16);
        return h.length == 1 ? '0'+h : h;
      }
      return '#' + th(rgb[0]) + th(rgb[1]) + th(rgb[2]);
    }

    function processImage(img, ctx) {
      var points = [];
      
      ctx.drawImage(img, 0, 0, 200, 200);
      data = ctx.getImageData(0, 0, 200, 200).data;

      for (var i = 0, l = data.length; i < l;  i += 4) {
        var r = data[i]
          , g = data[i+1]
          , b = data[i+2];
        points.push([r, g, b]);
      }
      var results = kmeans(points, 3, 1);

      var hex = [];

      for (var i = 0; i < results.length; i++) {
        hex.push(rgbToHex(results[i][0]));
      }
      return hex;
    }

    // return {
    //   chromaScale: scale
    // }
  }


  function makeAndShowChromaScale(){

    var $chromaScale = $('<div>').addClass('scale--chroma');
    var scaleColors = sample.chromaScale.colors(chromaNumStops);

     _.each(scaleColors, function(value, key) {

      var $swatch = $('<div>', {
        // src: 
        class: 'swatch swatch--chroma' ,
        css: {
          backgroundColor: sample.chromaScale(key *  (1/chromaNumStops) ).hex()
        }
      });

      $chromaScale.prepend($swatch);
    });

    var $scaleContainer = $('<div>').addClass('scale__container');
    $scaleContainer.prepend($chromaScale);
    $bitElement.prepend($scaleContainer);  
  }

  function makeAndShowVibrantScale(){
    var $vibrantScale = $('<div>').addClass('scale--vibrant');

    _.each(sample.vibSortedSwatches, function(value, key) {

      var colorPercent = _.toString(_.round(value.scaledPopulation, 2) * 100);
      var $swatch = $('<div>', {
        class: 'swatch swatch--vibrant vibrant--' + value.name ,
        css: {
            backgroundColor: value.hex
        },
        // figure the % this color represents from the total
        // then make the width of this box 
        // TODO: adjust for small %
        width: colorPercent + "%"
      });
      
      var colorName = nameThisColor(value.hex)[0].title;
      var colorText = value.name + ':' + colorPercent + ':' + colorName;
      // console.log('swatch color: ', colorName);
      // console.log('iteration', key);
      // console.log(colorText);

      $swatch.text(colorText);
      $vibrantScale.prepend($swatch);
    });

    var $scaleContainer = $('<div>').addClass('scale__container');
    $scaleContainer.prepend($vibrantScale);
    $bitElement.prepend($scaleContainer);    

  }


};

// TODO: check for image being loaded, and sample being processed before running this 
// one thing we can do is move the classifying to when the image is uploaded, and store values in db 
displayGradientAnimation = function displayGradientAnimation($bitElement, sample){

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

