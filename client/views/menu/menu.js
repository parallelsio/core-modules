Template.menu.helpers({

  bitEditing: function() { 
    return Session.get('bitEditing'); 
  },
  
  bitsCount: function() { 
    return Bits.find().count();
  } 
  
});



Template.menu.rendered = function() {
  console.log('menu rendered.');

  var menuBar = document.getElementById("menu-bar");
  TweenLite.to(menuBar, 1, { left:"632px" });


};

