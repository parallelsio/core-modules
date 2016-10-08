import _ from 'lodash';

Template.drawer.onRendered(function () {
  var template = this;
  var $drawer = $(this.firstNode);

  Parallels.Audio.player.play("fx-drdrrt");

  var $drawerBits = ($(".drawer-bits .bit"));

  // for non-destructively reversing
  // var $tempBits = $drawerBits.get().map(Array.apply.bind(Array, null));

  console.log('drawer: rendered.', $drawer, " : # bits: ", $drawerBits.length );
 // .add( function(){ console.log( "bits in drawer: ", $drawerBits.length ) } );

  var timeline = new TimelineMax();

  timeline
    .set('.drawer', { minHeight: $(document).height() } )
    
    .fromTo(
      $drawer, 
      0.3, 
      {
        x: -500 +  verge.scrollX(),
        y: verge.scrollY(),
        opacity: 0.25
      },
      { 
        x: 0 +  verge.scrollX(),
        y:  verge.scrollY(),
        opacity: 1,
        autoAlpha: 1,
        ease: Expo.easeOut
      }
    )

  // TODO: Meteor timeout is a hack, because the subscription is not ready.
  Meteor.setTimeout(function(){
     
    var timeline = new TimelineMax();
    timeline.staggerTo(
      ".drawer-bits .bit",
      0.25,
      {
        opacity: 1,
        autoAlpha: 1
      },
      0.05
    );

  }, 
  100
  );


});

