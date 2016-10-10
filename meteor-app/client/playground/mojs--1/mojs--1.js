import mojs from 'mo-js';
import MojsPlayer from 'mojs-player';
import MojsCurveEditor from 'mojs-curve-editor';
import _ from 'lodash';

// mojs workflow https://vimeo.com/185587462
wireMojsExplore1 = function mojsExplore1(){

	// setup
  // $("<div>")
  //   .addClass("square--mojs")
  //   .appendTo($(".map"));

	// var options = {
	// 	seedPoint: { x: 300, y: 300 },
	// 	debug: true
	// }

	// dont reuse these name properties, as they are shared in localStorage.
  var cloudChildrenCurve = new MojsCurveEditor({ 
    isSaveState: false, 
    name: 'cloudChildrenCurve' + _.random(0, 9999999999) 
  });

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



	// var square = new mojs.Html({
	// 	el: '.car',
	// 	y: { 0: 300 },
	// 	duration: 2000 // ms
	// });

	// var timeline = Parallels.Animation.General.poof(options);

		var timeline = new mojs.Timeline();
  timeline.add( cloud);

  cloud.tune( { x: 100, y: 100 });
  timeline.replay(); 

	new MojsPlayer({ add: timeline });
	$('#js-mojs-player').css({ zIndex: 100000 });

}
