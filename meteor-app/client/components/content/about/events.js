function closeAboutLightbox(event, template){
  console.log('click to close lightbox');

  var $about = $(template.firstNode);

  var timeline = new TimelineMax({
    onComplete: function(){
      console.log('done animating lightbox fade');
      Blaze.remove(template.view);

      $('.map').removeClass('map__lightbox');
      $('.parallels-lightbox').remove();
      $("body").css( "overflow", "initial");
      // $("body").css( "position", "static");
    },
    onCompleteParams:[ template ]
  });

  timeline.to($about, 1, {  alpha: 0, display: "none",  ease: Expo.easeOut  });
}


Template.aboutContent.events({

  'click .close-button': closeAboutLightbox,

  'click .content__about': function(event, template) {
    event.stopPropagation();
  }
});

