// https://vimeo.com/185587462


import mojs from 'mo-js';
// import MojsPlayer from 'mojs-player';
// import MojsCurveEditor from 'mojs-curve-editor';
import _ from 'lodash';


wireMojsExplore1 = function mojsExplore1(){

  $("<div>")
    .addClass("car")
    .appendTo($(".map"));



	var square = new mojs.Html({
		el: '.car',
		y: { 0: 300 },
		duration: 2000 // ms
	});

}


// new MojsPlayer({ add: square })