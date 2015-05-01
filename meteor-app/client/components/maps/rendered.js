Template.map.onRendered(function (){

  Sound.play(Sound.definitions.impulseDrop);

  var mapTemplate = this;
  var container = mapTemplate.find('.map');
  container._uihooks = {

    insertElement: function(node, next) {

      var bitDataContext = Blaze.getData(node); // get child data context (bit)
      var bitDatabaseId = bitDataContext._id;

      // TODO: use Greensock's force3D flag, instead of 0.01px hack [which triggers GPU rendering]
      var transformString =  "translate3d(" + bitDataContext.position.x + "px, " + bitDataContext.position.y + "px, 0.01px)";

      console.log('_uihook: moment before bit insert: ', bitDatabaseId);
      console.log('********');
      console.log('node: ', node);
      console.log('next: ', next);
      console.log('********');

      $(node)
        .hide()
        .insertBefore(next)
        .css( { transform: transformString } )
        .find('.editbit').focus();  // TODO: bug: focus doesnt work the 2nd time

        // TODO: add conditional to the editbit focus, as only relevant for text bits

        function timelineInsertDone(node){
          console.log("bit:insert:uihook timeline animate done.");
        }

        var timelineInsert = new TimelineMax({
          onComplete: timelineInsertDone,
          onCompleteParams:[ node ]
        });

        timelineInsert
          .to(node, 0, { x: bitDataContext.position.x, y: bitDataContext.position.y })
          .to(node, 0.125, { ease:Bounce.easeIn , display:'block', opacity: 0, alpha: 0 })
          .to(node, 0.125, { scale: 0.95, ease:Quint.easeOut , opacity: 1, alpha: 1} )
          .to(node, 0.275, { scale: 1, ease:Elastic.easeOut } );
    },


    removeElement: function(node) {

      function timelineRemoveDone(node){
        $(this).remove();
        console.log("bit:remove:uihook : timeline animate done. removed bit.");
      }

      var timelineRemove = new TimelineMax({
        onComplete: timelineRemoveDone,
        onCompleteParams:[ node ]
      });

      timelineRemove.to(node, 0.10, { opacity: 0, ease:Expo.easeIn, display: 'none' });
    }
  };

});




