// depends on 
//     "mo-js": "^0.288.1",
//     "mojs-curve-editor": "^1.4.5",
//     "mojs-player": "^0.43.15",


 
 // import mojs from 'mo-js';
// // import MojsPlayer from 'mojs-player';
// // import MojsCurveEditor from 'mojs-curve-editor';
// import _ from 'lodash';

// mojs workflow https://vimeo.com/185587462
wireMojsExplore1 = function mojsExplore1(){

  // setup
  $("<div>")
    .addClass("square--mojs")
    .appendTo($(".map"));

  var options = {
   seedPoint: { x: 300, y: 300 },
   debug: true
  }



   var cloud = new mojs.Burst({
      left: 0, 
      top: 0,
      radius:   { 4 : 49 },
      angle:    45,
      count:    12,
      children: {
        radius:       8,
        fill:         'white',
        scale:        { 
                          1 : 0,  // from value : to value
                          easing: cloudChildrenCurve.getEasing() 
        },
        pathScale:    [ .7, null ],
        degreeShift:  [ 13, null ],
        duration:     [ 500, 700 ],
        isShowEnd:    false,
        isForce3d:    true
      }
    });

  // dont reuse these name properties, as they are shared in localStorage.
  var cloudChildrenCurve = new MojsCurveEditor({ 
    isSaveState: false, 
    name: 'cloudChildrenCurve' + _.random(0, 9999999999) 
  });

  var cloudChildrenCurve = new MojsCurveEditor({
   isSaveState:  false,
   name: 'cloudChildrenCurve' + _.random(0, 9999999999) 
  });

  const polygon = new mojs.Shape({
    shape:       'polygon',
    points:       5,
    left:         '75%',
    fill:         { 'deeppink' : '#00F87F' },
    x:            { 'rand(-100%, -200%)' : 0  },
    angle:        { 0 : 'rand(0, 360)' },
    radius:       { 25 : 3 },

    duration:     2000,
    easing: cloudChildrenCurve.getEasing()
  });

  // var timeline = Parallels.Animation.General.poof(options);
  var timeline = new mojs.Timeline();

  timeline.add(
   // cloud, 
   polygon
  );

  // cloud.tune( { x: 100, y: 100 });
  timeline.replay(); 

  new MojsPlayer({ add: timeline });
  $('#js-mojs-player').css({ zIndex: 100000 });

}














  poof: function (options){

    // setting defaults, if not passed in
    options.speed = options.speed || 1;
    options.direction = options.direction || "forward";
    options.debug = options.debug || false;

    /*
     PURPOSE:
     Displays poof, with sparks. Animate outward sparks from a center point
     -----------------------------------------------------------

     OPTIONS/PARAMS:
     seedPoint:  object: x,y point of animation center/seed point
     direction:  string: "forward" or "backward"
     speed:      int: multiplier, passed into timeline object for how fast/slow to play animation
     
     -----------------------------------------------------------

     TODO:
     -----------------------------------------------------------
     - make colors part of options
     - create re-usable instances, vs adding/removing fx from DOM/ https://github.com/legomushroom/mojs/issues/62

     */

    // Adapted by combining elements from:
    // ---- https://codepen.io/sol0mka/full/03e9d8f2fbf886aa1505c61c81d782a0/
    // ---- https://codepen.io/sol0mka/pen/AXRAkg
    var burst = new mojs.Burst({
      left:           0, 
      top:            0,
      count:          8,
      radius:         { 50 : 150 },
      children: {
        shape:        'line',
        stroke:       [ 'white', '#FFE217', '#FC46AD', '#D0D202', '#B8E986', '#D0D202' ],
        scale:        1,
        scaleX:       { 1 : 0 },
        degreeShift:  'rand(-90, 90)',
        radius:       'rand(20, 40)',
        delay:        'rand(0, 150)',
        // pathScale:    'rand(.5, 1.25)',
        // duration:     200,
        isForce3d:    true,
        isShowEnd:    false
      }
    });

    // If debugger is on, show mojs workflow tools https://vimeo.com/185587462
    // otherwise, default to designed easing curve
    // TODO: this is buggy, and causing crashing on multiple sequential actions
    if (options.debug){
      var cloudChildrenCurve = new MojsCurveEditor({ 
        isSaveState: false, 
        name: 'cloudChildrenCurve' + _.random(0, 9999999999) 
      });

      var easeValue = cloudChildrenCurve.getEasing();
    }

    else {
      var easeValue = 'sin.in';
    }

    var cloud = new mojs.Burst({
      left:     0, 
      top:      0,
      radius:   { 4 : 49 },
      angle:    45,
      count:    12,
      children: {
        radius:       8,
        fill:         'white',
        scale:        { 
                          1 : 0,  // from value : to value
                          easing: easeValue
        },
        pathScale:    [ .7, null ],
        degreeShift:  [ 13, null ],
        duration:     [ 500, 700 ],
        isShowEnd:    false,
        isForce3d:    true
      }
    });

    var timeline = new mojs.Timeline({
      speed: options.speed, 
      
      onPlaybackComplete: function(){
        $(this.el).remove();
      }
    });

    timeline.add( cloud, burst );

    cloud.tune(options.seedPoint);
    burst
      .tune(options.seedPoint)
      .generate()
    
    if (options.direction === "forward"){
      timeline.replay(); 
    }

    else if (options.direction === "backward"){
      timeline.replayBackward();
    }

    if (options.debug) { new MojsPlayer({ add: timeline }); };

    return timeline; // if it's needed, for chaining
  }

  


  poof: function (options){

    // setting defaults, if not passed in
    options.speed = options.speed || 1;
    options.direction = options.direction || "forward";
    options.debug = options.debug || false;

    /*
     PURPOSE:
     Displays poof, with sparks. Animate outward sparks from a center point
     -----------------------------------------------------------

     OPTIONS/PARAMS:
     seedPoint:  object: x,y point of animation center/seed point
     direction:  string: "forward" or "backward"
     speed:      int: multiplier, passed into timeline object for how fast/slow to play animation
     
     -----------------------------------------------------------

     TODO:
     -----------------------------------------------------------
     - make colors part of options

     */

    // Adapted by combining elements from:
    // ---- https://codepen.io/sol0mka/full/03e9d8f2fbf886aa1505c61c81d782a0/
    // ---- https://codepen.io/sol0mka/pen/AXRAkg
    var burst = new mojs.Burst({
      left:           0, 
      top:            0,
      count:          8,
      radius:         { 50 : 150 },
      children: {
        shape:        'line',
        stroke:       [ 'white', '#FFE217', '#FC46AD', '#D0D202', '#B8E986', '#D0D202' ],
        scale:        1,
        scaleX:       { 1 : 0 },
        degreeShift:  'rand(-90, 90)',
        radius:       'rand(20, 40)',
        delay:        'rand(0, 150)',
        // pathScale:    'rand(.5, 1.25)',
        // duration:     200,
        isForce3d:    true,
        isShowEnd:    false
      }
    });

    // If debugger is on, show mojs workflow tools https://vimeo.com/185587462
    // otherwise, default to designed easing curve
    // TODO: this is buggy, and causing crashing on multiple sequential actions
    if (options.debug){
      var cloudChildrenCurve = new MojsCurveEditor({ 
        isSaveState: false, 
        name: 'cloudChildrenCurve' + _.random(0, 9999999999) 
      });

      var easeValue = cloudChildrenCurve.getEasing();
      $('#js-mojs-player').css({ zIndex: 100000 });
    }

    else {
      var easeValue = 'sin.in';
    }

    var cloud = new mojs.Burst({
      left:     0, 
      top:      0,
      radius:   { 4 : 49 },
      angle:    45,
      count:    12,
      children: {
        radius:       8,
        fill:         'white',
        scale:        { 
                          1 : 0,  // from value : to value
                          easing: easeValue
        },
        pathScale:    [ .7, null ],
        degreeShift:  [ 13, null ],
        duration:     [ 500, 700 ],
        isShowEnd:    false,
        isForce3d:    true
      }
    });

    var timeline = new mojs.Timeline({
      speed: options.speed, 
      
      onPlaybackComplete: function(){
        $(this.el).remove();
      }
    });

    timeline.add( cloud, burst );

    cloud.tune(options.seedPoint);
    burst
      .tune(options.seedPoint)
      .generate()
    
    if (options.direction === "forward"){
      timeline.replay(); 
    }

    else if (options.direction === "backward"){
      timeline.replayBackward();
    }

    if (options.debug) { new MojsPlayer({ add: timeline }); };

    return timeline; // if it's needed, for chaining
  }


// skip a beat, then display the delete animation
    // not just stylistic, added benefit of not overlapping with Greensock fade to decrease CPU use

    Meteor.setTimeout(function(){
      Parallels.Animation.General.poof(options);
      }, 
      325
    );


    // bit/base/rendered.js
    // Is this bit autorun a result of a bit redo after a delete?
    // TODO: janky, need a better way of pinpointing this scenario
    var bitRect = $bit[0].getClientRects()[0];
    if (bitRect){
      // Use bit center point as spark point for animation
      var coords = Utilities.getElementCenter(bitRect);
      var options = {
        seedPoint: coords,
        direction: "backward",
        speed: 1.5
      }

      Parallels.Animation.General.poof(options);
    }