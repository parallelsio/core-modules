Template.feed.helpers({
  bits: function() {
    return Bits.find();
  }
});

Template.feed.rendered = function(){

  var $activityFeed = $('body > .demo.page.dimmer');

  $('.center').bind('mousewheel DOMMouseScroll', function(e) {
    var scrollTo = null;

    if (e.type == 'mousewheel') {
      scrollTo = (e.originalEvent.wheelDelta * -1);
    }
    else if (e.type == 'DOMMouseScroll') {
      scrollTo = 40 * e.originalEvent.detail;
    }

    if (scrollTo) {
      e.preventDefault();
      $(this).scrollTop(scrollTo + $(this).scrollTop());
    }
  });

  Mousetrap.bind("m", function() {
    if ($activityFeed.is(":visible")) {
      $activityFeed.dimmer('hide');
    } else {
      $activityFeed.dimmer('show');
    }
  });

  var droppables = $(".card");
  var $card;
  var $original;

  Draggable.create(droppables, {
    bounds: '.map',
    onDragStart: function(e) {
      $original = $(this.target);
      $card = $original.clone(true);

      // 14 is the top/bottom margin for each card in the feed.
      var top = ($original.position().top - ($original.position().top - $original.offset().top + 14 * 3));

      // 538.5 is the left/right padding on the activity feed.
      var left = (($original.offset().left - 538.5) - $original.position().left);

      $card.css('top', top);
      $card.css('left', left);
      $card.css('transform', $original.css('transform'));

      $('#dropzone').append($card);

      $activityFeed.css('visibility', 'hidden');
      $('.drop').show();
    },
    onDrag: function(e) {
      $card.css('transform', $original.css('transform'))
    },
    onDragEnd:function(e) {
      $('#dropzone').empty();
      $('.drop').hide();
      $activityFeed.dimmer('hide');
    }
  });
};

Template.feed.events({
  'dblclick .map': function (event, template){
  }
});
