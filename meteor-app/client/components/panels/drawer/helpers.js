Template.drawer.helpers({

  drawerBits: function(){
    // return Template.instance().drawerBitsNow;
  	// return Bits.find( {}, { sort: { createdAt: -1 }, limit: 50 });
  	return Bits.find( {}, { sort: { createdAt: -1 } });

  }

});



