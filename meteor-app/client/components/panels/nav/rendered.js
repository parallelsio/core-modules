import ClipperLib from "js-clipper";
import _ from "lodash";

Template.navPanel.rendered = function() {

  // TODO: wire up for reactivity, so map re-generates as bits are added/removed
  // maybe move to a worker, not sure how CPU intensive this is
  // This demo shows benchmarks: http://jsclipper.sourceforge.net/6.2.1.0
  function drawSetOutline(){
    var $bits = $(".bit");
    var subjectPaths = [];

    var mapWidth = Session.get('mapWidth');
    var mapHeight = Session.get('mapHeight');

    _.forEach($bits, function(value, key) {
      var rect = value.getBoundingClientRect();

      var bitPoints = []; 
      bitPoints.push( { X: _.round(rect.left, 2),     Y: _.round(rect.top, 2)} );
      bitPoints.push( { X: _.round(rect.right, 2),    Y: _.round(rect.top, 2)} );
      bitPoints.push( { X: _.round(rect.right, 2),    Y: _.round(rect.bottom, 2)} );
      bitPoints.push( { X: _.round(rect.left, 2),     Y: _.round(rect.bottom, 2)} );

      subjectPaths.push(bitPoints);
    });

    // console.log("subject: ", JSON.stringify(subjectPaths));

    // we don't need clipPaths for the union of the shapes
    var clipPaths = [
    //   [{X:50,Y:50},{X:150,Y:50},{X:150,Y:150},{X:50,Y:150} ],
    //   [{X:60,Y:60},{X:60,Y:140},{X:140,Y:140},{X:140,Y:60}]
    ];

    var cpr = new ClipperLib.Clipper();

    var scale = 1;
    // ClipperLib.JS.ScaleUpPaths(subjectPaths, scale);
    // ClipperLib.JS.ScaleUpPaths(clipPaths, scale);

    // .AddPaths( paths, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
    cpr.AddPaths(subjectPaths, ClipperLib.PolyType.ptSubject, true);  
    // cpr.AddPaths(clipPaths, ClipperLib.PolyType.ptClip, true);

    var solutionPaths = new ClipperLib.Paths();
    
    // drawing the union of all the bits
    // TODO: trace edge, like https://graphicdesign.stackexchange.com/questions/50697/how-can-i-trace-the-edge-of-a-svg-file-using-inkscape-without-rasterizing-the-im
    var succeeded = cpr.Execute(
      ClipperLib.ClipType.ctUnion, 
      solutionPaths, 
      ClipperLib.PolyFillType.pftNonZero,  // subjFillType
      ClipperLib.PolyFillType.pftNonZero   // clipFillType
    );

    var viewBox = "0 0 " + mapWidth + " " + mapHeight; 

    var svg = '<svg class="outline__svg" viewbox="' + viewBox + '" preserveAspectRatio="xMinYMax meet" >'; 
    svg += '<path stroke="black" fill="yellow" stroke-width="5" d="' + paths2string(solutionPaths, scale) + '"/>';
    svg += '</svg>';

    document.getElementsByClassName("outline__container")[0].innerHTML = svg;

    // Converts Paths to SVG path string
    // and scales down the coordinates
    function paths2string (paths, scale) {
      var svgpath = "", i, j;
      if (!scale) scale = 1;
      for(i = 0; i < paths.length; i++) {
        for(j = 0; j < paths[i].length; j++){
          if (!j) svgpath += "M";
          else svgpath += "L";
          svgpath += (paths[i][j].X / scale) + ", " + (paths[i][j].Y / scale);
        }
        svgpath += "Z";
      }
      if (svgpath == "") svgpath = "M0,0";
      return svgpath;
    }

    // adapted from: https://stackoverflow.com/questions/29002472/find-svg-viewbox-that-trim-whitespace-around
    // redraw the map outline, removing all unused whitespace from the map
    // TODO: doing so also rescales to fit, so the preview gets really big
    // on maps with small surface area. Need to figure out a solution that works
    // consistently across map sizes
    // function setViewbox(svg) {
    //   var bB = svg.getBBox();
    //   svg.setAttribute('viewBox', bB.x + ',' + bB.y + ',' + bB.width + ',' + bB.height);
    // }

    // this overwrites the standard way    
    // setViewbox($('.outline__svg')[0]);
  }

  // TODO: extract this choreographed sequence out of nav.
  // doesnt belong here, but somewhere in Map: when Map/canvas open
  // it triggers the nav + bits to be displayed

  var displayIntro = Parallels.utils.stringToBoolean(Session.get('PARALLELS_DISPLAY_INTRO_ANIMATION') || true);
  if (displayIntro) {

    var timelineSequence = new TimelineMax({ paused: true });

    // TODO: extract into Animation class
    // adapted from: http://codepen.io/vdaguenet/pen/raXBKp
    function timelineMenu () {

      var menu = $(".nav-panel");
      var viewportWidth  = verge.viewportW();
      var viewportHeight = verge.viewportH();
      var timeline = new TimelineMax();

      var topToBottomLine  = $('.wipe.top-to-bottom .line');
      var maskTop          = $('.wipe.top-to-bottom .mask.top');
      var maskBottom       = $('.wipe.top-to-bottom .mask.bottom');

      var sideToSideLine   = $('.wipe.side-to-side .line');
      var maskLeft         = $('.wipe.load.side-to-side .mask.left');
      var maskRight        = $('.wipe.load.side-to-side .mask.right');

      TweenMax.set($('.wipe.load.side-to-side'), { alpha: 0 });

      timeline.fromTo(topToBottomLine, 0.4, { x: viewportWidth }, { x: 0, ease: Circ.easeIn }, 0);
      timeline.fromTo(maskTop, 0.4, { y: 0 }, { y: -viewportHeight / 2, ease: Expo.easeOut, delay: 0.1 }, 0.4);
      timeline.fromTo(maskBottom, 0.4, { y: 0 }, { y: viewportHeight / 2, ease: Expo.easeOut, delay: 0.1 }, 0.4);
      timeline.set($('.wipe.load.top-to-bottom'), { alpha: 0, display: "none" });

      timeline.set($('.wipe.load.side-to-side'), { alpha: 1, display: "block"});
      timeline.fromTo(sideToSideLine, 0.4, { y: -viewportHeight}, {y: 0, ease: Circ.easeIn});
      timeline.fromTo(maskRight, 0.4, { x: 0 }, {x: viewportWidth / 2, ease: Expo.easeOut, delay: 0.1 }, 1.2); // 2.5
      timeline.fromTo(maskLeft, 0.4, { x: 0 }, {x: -viewportWidth / 2, ease: Expo.easeOut, delay: 0.1 }, 1.2);
      timeline.set($('.wipe.load.side-to-side'), { alpha: 0, display: "none" });

      timeline.to(menu, 1, { top: "0", ease:Elastic.easeOut });

      return timeline;
    }

    // Greensock .call is similar to its .add,
    // except .call lets us pass params to our function
    timelineSequence

      .add(timelineMenu())
    
      .call(
        Parallels.Animation.General.shimmer,
        [
          { $elements: $(".map .bit") }
        ],
        "-=0.5"
      )

      .play();

    // TODO: Meteor timeout is a hack, because the bits are not yet rendered.
    Meteor.setTimeout(function(){
      drawSetOutline();
      }, 
      3000
    );


  }

  else {
    $('.wipe.load').hide();
  }
};

