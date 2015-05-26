Template.map.onRendered(function (){
  
  // TODO: why isnt this working here? is sample not yet loaded?
  // Parallels.Audio.player.play('fx-welcome-v1');

  var mapTemplate = this;
  var container = mapTemplate.find('.map');
  container._uihooks = {

    insertElement: function(node, next) {
      var bitDataContext = Blaze.getData(node) || Session.get('newTextBit');

      $(node).insertBefore(next);

      function timelineInsertDone (node) {
        $(node).find('.editbit').focus();
      }

      var timelineInsert = new TimelineMax({
        onComplete: timelineInsertDone,
        onCompleteParams:[ node ]
      });

      timelineInsert
        .to(node, 0, { x: bitDataContext.position.x, y: bitDataContext.position.y })
        .to(node, 0.125, { ease: Bounce.easeIn , display: 'block', opacity: 1, alpha: 1 })
        .to(node, 0.125, { scale: 0.95, ease: Quint.easeOut } )
        .to(node, 0.275, { scale: 1, ease: Elastic.easeOut } );
    },


    removeElement: function(node) {

      function timelineRemoveDone(node){
        $(node).remove();
        log.debug("bit:remove:uihook : timeline animate done. removed bit.");
      }

      var timelineRemove = new TimelineMax({
        onComplete: timelineRemoveDone,
        onCompleteParams:[ node ]
      });

      timelineRemove.to(node, 0.10, { opacity: 0, ease:Expo.easeIn, display: 'none' });
    }
  };

});





