Template.navPanel.events({

  'click .nav-panel__primary': function (event, template) {
    Parallels.Panels.toggleShortcuts();
  },

  'click .nav-panel__link__about': function (event, template) {

    // prep container for lightbox
    $("<div>")
      .addClass("parallels-lightbox")
      .addClass("parallels-lightbox__about")
      .appendTo($("body"));

    $("body").css( "overflow-x", "hidden");
    $("body").css( "position", "static");

    // inject the content into it 
    Blaze.render(Template.aboutContent, _.first($(".parallels-lightbox__about")) );

    $(".map").addClass('map__lightbox');

  }

});


