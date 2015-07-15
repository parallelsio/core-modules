Template.navPanel.events({

  'click .nav-panel__primary': function (event, template) {
    Mousetrap.trigger('1'); 
  },

  'click .nav-panel__link__about': function (event, template) {

    // prep container for lightbox
    $("<div/>")
      .addClass("parallels-lightbox")
      .addClass("parallels-lightbox__about")
      .appendTo($("body"));

    // inject the content into it 
    Blaze.render(Template.aboutContent, _.first($(".parallels-lightbox__about")) );

    // render template into it
    // animate it in
    // .morph from element size to full viewport size
    // .shimmer in content, with X button
    //.wire X button to close, with Blaze.remove()

  }

});


