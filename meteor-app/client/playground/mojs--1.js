import mojs from 'mo-js';
import MojsPlayer from 'mojs-player';
import MojsCurveEditor from 'mojs-curve-editor';
import _ from 'lodash';

// mojs workflow https://vimeo.com/185587462


wireMojsExplore1 = function mojsExplore1(){

	// setup
  $("<div>")
    .addClass("square--mojs")
    .appendTo($(".map"));

   // 

	var options = {
		seedPoint: { x: 300, y: 300 }
	}

	var timeline = Parallels.Animation.General.poof(options);

	new MojsPlayer({ add: timeline });
	$('#js-mojs-player').css({ zIndex: 100000 });







}
