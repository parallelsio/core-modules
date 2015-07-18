function closeAboutLightbox(event, template){
  console.log('click to close lightbox');

  var $about = $(template.firstNode);

  var timeline = new TimelineMax({
    onComplete: function(){
      console.log('done animating lightbox fade');
      Blaze.remove(template.view);

      $('.parallels-lightbox').remove();

      // TODO: make Utility function
      // reenable scrolling
      $("body").css( "overflow", "visible");
      $("body").css( "position", "static");
      $('.map').removeClass('map__lightbox');
    },
    onCompleteParams:[ template ]
  });

  timeline.to($about, 0.2, {  alpha: 0, display: "none",  ease: Expo.easeOut  });
}


Template.aboutContent.events({

  'click .close-button': closeAboutLightbox,

  'click .content__about': function(event, template) {
    event.stopPropagation();
  }
});


