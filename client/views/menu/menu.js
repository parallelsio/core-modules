Template.menu.helpers({

  bitEditing: function() { 
    return Session.get('bitEditing'); 
  },
  
  bitsCount: function() { 
    return Bits.find().count();
  } 
  
});



Template.menu.rendered = function() {
  console.log('menu rendered.');

  


  // *********************************************************************

  // Zelda transitions

  // inspired by          : https://www.youtube.com/watch?v=wHaZrYX0kAU&t=14m54s
  // adapated code from   : http://codepen.io/vdaguenet/pen/Ebycz

  var screenWidth;
  var screenHeight;

  function start () {
      resize();
      window.addEventListener('resize', resize);

      var tlLoader     = setTimelineLoader();
      var tlGlobal     = new TimelineMax();

      tlGlobal.set($('.overlay'), {alpha: 0});
      tlGlobal.add(tlLoader);

      tlGlobal.set($('.overlay'), {alpha: 1});
      tlGlobal.play();
  };

  function resize () {
      screenWidth  = document.documentElement.clientWidth,
      screenHeight = document.documentElement.clientHeight;
  };

  function setTimelineLoader () {
      var first            = $('.line.first'),
          maskTop          = $('.mask.top'),
          maskBottom       = $('.mask.bottom');

      var second           = $('.line.second'),
          maskLeft         = $('.mask.left'),
          maskRight        = $('.mask.right');

      TweenMax.set($('.loader.second'), {alpha: 0});

      var tl = new TimelineMax();

      tl.fromTo(first, 0.4, {x: screenWidth}, {x: 0, ease: Circ.easeIn}, 0);
      tl.fromTo(maskTop, 0.4, {y: 0}, {y: -screenHeight/2, ease: Expo.easeOut, delay: 0.1}, 0.4);
      tl.fromTo(maskBottom, 0.4, {y: 0}, {y: screenHeight/2, ease: Expo.easeOut, delay: 0.1}, 0.4);
      tl.set($('.loader.first'), {alpha: 0, display: "none" });

      tl.set($('.loader.second'), {alpha: 1});
      tl.fromTo(second, 0.4, {y: -screenHeight}, {y: 0, ease: Circ.easeIn});
      tl.fromTo(maskRight, 0.4, {x: 0}, {x: screenWidth/2, ease: Expo.easeOut, delay: 0.1}, 1.2); // 2.5
      tl.fromTo(maskLeft, 0.4, {x: 0}, {x: -screenWidth/2, ease: Expo.easeOut, delay: 0.1}, 1.2);
      
      // set height + width to auto so events on the map can be captured
      tl.set($('.loader.second'), {alpha: 0, display: "none" });

      return tl;
  };

  // run wipe transition
  start();

  // 
  // .loader 

  // *********************************************************************




  var menuBar = document.getElementById("menu-bar");
  TweenMax.to(menuBar, 1, { top:"0px", ease:Elastic.easeOut});


  
};

