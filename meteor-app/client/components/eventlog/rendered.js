Template.eventlog.onRendered(function () {
  var $eventLog = $(this.firstNode);
  var timeline = new TimelineMax();

  timeline.to($eventLog, 0.5, {
    alpha: 1,
    ease: Power2.easeInOut
  });

  $eventLog.bind('mousewheel DOMMouseScroll', function(e) {
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
});
