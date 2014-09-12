Template.menu.helpers({

  bitEditing: function() { 
    return Session.get('bitEditing'); 
  },
  
  bitsCount: function() { 
    return Bits.find().count();
  } 
  
});
