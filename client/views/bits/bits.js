Template.bit.rendered = function() {

  console.log("Template.bit.rendered: " + this.data._id);
  // console.log(bits);
  // console.log(this.data.id);
  // console.log(this);

  // TODO: this should work according to:
  // http://www.meteorpedia.com/read/Blaze_Notes
  // but does not. why?
  // var elem = this.$('.bit');

  var elem = document.querySelector('#bit-' + this.data.id);
  console.log("elem: #" +  elem.id );

  var drag = new Draggabilly(elem, { 
    handle: 'p'
  });

  drag.on('dragStart', function( instance, event, pointer ) {
      console.log(event.type + ": " + instance.position.x + " : " + instance.position.y);
    }
  );

  drag.on('dragEnd', function( instance, event, pointer ) {

      console.log(instance);
      console.log(instance.element);
      console.log($(instance.element));
      console.log(instance.element.id);

      var x = instance.position.x;
      var y = instance.position.y;

      var mongoId = instance.element.id;
      // var mongoId = 'dummy';

      console.log(event.type + ": " + mongoId + " : " + x + " : " + y);
      
      // Bits.update(mongoId, {
      //   $set: {
      //     "position_x": x,
      //     "position_y": y
      //   }
      // });

      showNotification("bit " + mongoId + " position saved: x: " + x + " y: " + y);
      return true;
    }

  );





};







