Template.infoMenu.rendered = function() {
  // todo: Meteor.settings.public.options.displayIntroAnimation
  if (true) {

    var timelineSequence = new TimelineMax({ paused: true });

    // Greensock .call is similar to its .add,
    // except .call lets us pass params to our function
    timelineSequence
      .add(timelineMenu())
      .call(
        Parallels.Animation.General.shimmer,
        [
          { $elements: $(".map .bit") }
        ])
      .play();

    // TODO: extract into Animation class
    // adapted from: http://codepen.io/vdaguenet/pen/raXBKp
    function timelineMenu () {

      var menu = $(".info-menu");
      var viewportWidth  = 1385; // verge.viewportW();
      var viewportHeight = 534; // verge.viewportH();
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

  }

  else {
    $('.wipe. load').hide();
  }


};

