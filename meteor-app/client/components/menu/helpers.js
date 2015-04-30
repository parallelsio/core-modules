Template.menu.helpers({

  bitEditingId: function() { 
    return Session.get('bitEditingId'); 
  },
  
  bitsCount: function() { 
    return Bits.find().count();
  } 
  
});
