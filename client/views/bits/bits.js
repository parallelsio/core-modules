Template.bit.rendered = function() {

  bits = document.getElementsByClassName('.bit');

  // this.$(".bit").addClass("debug");

  console.log("Template.bit.rendered: " + this.data._id);
  console.log(bits);
  console.log(this.data);
  console.log(this);
  console.log("");

  // var drag = new draggabilly('.bit', {
  //   grid: [20, 20]
  // });

  // jquery implementation drag + drop works,
  // but want to replace to use Draggabilly instead

  $(".bit").draggable({
    
    // wire drag to handle only
    handle: "p",
    
    stop: function(event, ui) {
      var mongoId, positionX, positionY;
      mongoId = UI.getElementData(this)._id;
      positionX = Math.round(ui.position.left);
      positionY = Math.round(ui.position.top);
      console.log("stop dragging: " + mongoId + " : " + positionX + " : " + positionY);
      Bits.update(mongoId, {
        $set: {
          "position_x": positionX,
          "position_y": positionY
        }
      });

      showNotification("" + mongoId + " position saved: x: " + positionX + " y: " + positionY);
      return true;
    }
  });
};







