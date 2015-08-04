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
      $('body').css( 'overflow', 'visible');
      $('body').css( 'position', 'static');
      $('.map').removeClass('map__lightbox');
    },
    onCompleteParams:[ template ]
  });

  timeline.to($about, 0.2, {  alpha: 0, display: 'none',  ease: Expo.easeOut  });
}



Template.aboutContent.events({

  'click .close-button': closeAboutLightbox,

  'click .about': function(event, template) {
    event.stopPropagation();
  },

  'click .about__menu-link': function(event, template){

    var $link = $( event.target ).parent();

    if ( $link.hasClass("detailed") ) {
      $link.html('<span class=about__menu-link-arrow>▲</span><span class=about__menu-link-text>hide detailed</span>');
      $link.removeClass('detailed');
      $link.addClass('summary');
    } 

    else if ( $link.hasClass( "summary" )) {
      $link.html('<span class=about__menu-link-arrow>▼</span><span class=about__menu-link-text>show detailed</span>');
      $link.removeClass('summary');
      $link.addClass('detailed');
    }

    $( '.about__content-detailed' ).slideToggle( 'fast' );
    $( '.about__content-summary' ).slideToggle( 'fast' );

  }


});


