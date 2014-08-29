Template.bit.rendered = function() {

  console.log("Template.bit.rendered: " + this.data._id);

  // TODO: this should work according to:
  // http://www.meteorpedia.com/read/Blaze_Notes
  // but does not, why?
  // var elem = this.$('.bit');

  var elem = document.querySelector("[data-id='" + this.data._id + "']");
  elem.style.left = this.data.position_x + "px";
  elem.style.top = this.data.position_y + "px";
  elem.classList.add(this.data.type);

  // var drag = new Draggabilly(elem, { 
  //   handle: 'p'
  // });


  // drag.on('dragEnd', function( instance, event, pointer ) {

  //     var x = instance.position.x;
  //     var y = instance.position.y;

  //     var mongoId = instance.element.dataset.id;
  //     console.log(event.type + ": " + mongoId + " : " + x + " : " + y);
      
  //     Bits.update( mongoId , {
  //       $set: {
  //         "position_x": x,
  //         "position_y": y
  //       }
  //     });

  //     showNotification("bit " + mongoId + " position saved: x: " + x + " y: " + y);
  //     return true;
  //   }
  // );










};


Template.bit.events({

  'mouseenter .bit': function (event, template){
    event.preventDefault();
    event.stopPropagation();

    if (event.target.classList.contains('bit')) {
      Session.set('bitHovering', template.data._id);
      console.log("bit:hover:in " + Session.get('bitHovering'));
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









