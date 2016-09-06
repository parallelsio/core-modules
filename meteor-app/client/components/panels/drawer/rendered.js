import _ from 'lodash';

Template.drawer.onRendered(function () {
  var $drawer = $(this.firstNode);
  var timeline = new TimelineMax();

  console.log('drawer: rendered.');

  var template = this;
  var mapElement = template.find('.map');

  // Parallels.Audio.player.play("sdrums--placeholder--0040_static3");

  timeline
    .fromTo(
      $drawer, 
      0.5, 
      {
        opacity: 0.25
      },
      { 
        opacity: 1,
        autoAlpha: 1,
        ease: Expo.easeOut
      }
    )

});
