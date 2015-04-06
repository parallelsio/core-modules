Template.map.helpers({
  bits: function() {
    return Bits.find();
  }
});


Template.map.gestures({
  'press .map': function (event, template) {
    /* Do something when user swipes left on .item .panel (elements(s) inside the template html) */
    /* `event` is the Hammer.js event object */
    /* `template` is the `Blaze.TemplateInstance` */
    /* `this` is the data context of the element in your template */

    sound.play('glue.mp3');


  }
});


Template.map.rendered = function(){
  
  sound.play('welcome-v1.mp3');

};

Template.map.events({
  'dblclick .map': function (event, template){
    event.preventDefault();
    event.stopPropagation();

    console.log("bit:text:create");

    if(event.target.classList.contains('map')){
      var id = Bits.insert( { 
                  content: '',
                  type: 'text', 
                  color: 'white',
                  position_x: event.pageX, 
                  position_y: event.pageY });

      Session.set('bitEditingId', id);

    }
  }
  

});
