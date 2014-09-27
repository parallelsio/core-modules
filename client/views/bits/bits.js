Template.bit.helpers({
 
});

Template.bit.rendered = function() {

  // http://greensock.com/docs/#/HTML5/GSAP/Utils/Draggable
  Draggable.create(Template.instance().firstNode, {
    throwProps:true,
    zIndexBoost:false,
    onDragEnd:function( event ) {
      console.log("done dragging.");

      var x = event.pageX;
      var y = event.pageY;

      var mongoId = this.target.dataset.id;
      console.log(event.type + ": " + mongoId + " : " + x + " : " + y);
      
      Bits.update( mongoId , {
        $set: {
          "position_x": x,
          "position_y": y
        }
      });

      // showNotification("bit " + mongoId + " position saved: x: " + x + " y: " + y);
      return true;
    }
  });

  console.log("Template.bit.rendered: " + this.data._id);

  // TODO: this should work according to:
  // http://www.meteorpedia.com/read/Blaze_Notes
  // but does not, why?
  // var elem = this.$('.bit');

  var elem = document.querySelector("[data-id='" + this.data._id + "']");


  elem.style.left = this.data.position_x + "px";
  elem.style.top = this.data.position_y + "px";
  elem.classList.add(this.data.type);

};


Template.bit.events({

  'mouseenter .bit': function (event, template){
    event.preventDefault();
    event.stopPropagation();

    if (event.target.classList.contains('bit')) {
      Session.set('bitHovering', template.data._id);
      console.log("bit:hover:in " + Session.get('bitHovering'));

      // TweenLite.to(Template.instance().firstNode, 0.3, { left:"+=10px", ease:Elastic.easeOut});
      // var yoyo = myTimeline.yoyo(); //gets current yoyo state
      // myTimeline.yoyo( true ); //sets yoyo to true


    }
  },

  'mouseleave .bit': function (event, template){
    event.preventDefault();
    event.stopPropagation();

    if (event.target.classList.contains('bit')) {
      Session.set('bitHovering', '');
      console.log("bit:hover:out " + Session.get('bitHovering'));
    }
  },

  'dblclick .bit': function (event, template){
    event.preventDefault();
    event.stopPropagation();

    Session.set('bitEditing',this._id);
    console.log("bit:edit: " + Session.get('bitEditing'));

  },

  'keyup .bit': function (event, template){
    event.stopPropagation();
    event.preventDefault();

    // console.log('bit:key up: key code:' + event.which + ': ');

    if(event.which === 13){
      Bits.update( this._id , {
        $set: { "content": template.find('.editbit').value }
      });

      Session.set('bitEditing',null);
    }

    else if (event.which === 27) {
      console.log('escape key');
      Session.set('bitEditing', null);
    }
  }

});



Template.bit.isEditingThisBit = function() {
  return Session.equals('bitEditing', this._id);
};









