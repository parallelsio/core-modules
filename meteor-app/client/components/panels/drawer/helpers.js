Template.drawer.helpers({

  drawerBits: function(){
  	// using a fetch here, because we don't need reactivity for this view.
  	// limited to a low number, and person can infinitely scroll for more results
  	return Bits.find( {}, { sort: { createdAt: -1 }, limit: 100 }).fetch();
	}

	// ,
	// currentColor: function(){
	// 	return Template.instance().bgColor.get() ;
	// }   

});



