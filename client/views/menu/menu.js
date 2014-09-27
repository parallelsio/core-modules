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
  TweenMax.to(menuBar, 1, { top:"0px", ease:Elastic.easeOut});
  
};

