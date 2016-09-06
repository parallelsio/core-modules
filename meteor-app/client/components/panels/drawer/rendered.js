import _ from 'lodash';

Template.drawer.onRendered(function () {
  var $drawer = $(this.firstNode);
  var timeline = new TimelineMax();

  console.log('drawer: rendered.');

  timeline
    .fromTo(
      $drawer, 
      0.75, 
      {
        opacity: 0.25
      },
      { 
        opacity: 1,
        autoAlpha: 1,
        boxShadow: "rgba(0, 0, 0, 0.2) 0 16px 32px 0", 
        ease: Expo.easeOut
      }
    )

});
