Template.bit.rendered = function() {

  console.log("Template.bit.rendered: " + this.data._id);
  // console.log(bits);
  // console.log(this);

  // TODO: this should work according to:
  // http://www.meteorpedia.com/read/Blaze_Notes
  // but does not, why?
  // var elem = this.$('.bit');

  var elem = document.querySelector("[data-id='" + this.data._id + "']");

  var drag = new Draggabilly(elem, { 
    handle: 'p'
  });

  // drag.on('dragStart', function( instance, event, pointer ) {
  //     console.log(event.type + ": " + instance.position.x + " : " + instance.position.y);
  //   }
  // );

  drag.on('dragEnd', function( instance, event, pointer ) {

      var x = instance.position.x;
      var y = instance.position.y;

      var mongoId = instance.element.dataset.id;
      console.log(event.type + ": " + mongoId + " : " + x + " : " + y);
      
      Bits.update(  { _id: mongoId } , {
        $set: {
          "position_x": x,
          "position_y": y
        }
      });

      showNotification("bit " + mongoId + " position saved: x: " + x + " y: " + y);
      return true;
    }

  );





};







