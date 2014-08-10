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

		if(event.target.className === 'map'){
      		var id = Bit.insert( { name:'new bit', position_x: event.pageX, position_y: event.pageY });
      		Session.set('editing_table', id);
    	}

	}



});
