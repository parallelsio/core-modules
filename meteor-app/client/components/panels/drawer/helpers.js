Template.drawer.helpers({

  drawerBits: function(){
    return Bits.find({}, {sort: {timestamp: -1}, limit: 50});
  }


});



