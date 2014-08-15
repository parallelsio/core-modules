Template.map.helpers({
  bits: function() {
    return Bits.find();
  }
});



Template.map.events({
  'dblclick .map': function (event, template){
    event.preventDefault();
    event.stopPropagation();

    console.log("bit:create");

    if(event.target.classList.contains('map')){
      var id = Bits.insert( { 
        content:'',
        type: 'text', 
        color:'white',
        position_x: event.pageX, 
        position_y: event.pageY });

      Session.set('bitEditing', id);
      }
  }

  

});
