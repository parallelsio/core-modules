Template.map.helpers({

  bits: function() {
    var myBits = Template.instance().bits.get();
    // console.log(myBits);

    return myBits;
  }
});
    // return Bits.find();
    // var Bits = Meteor.neo4j.call('allBits',{});
    // return Bits;
    // console.log(Template.instance().bits.get());
    // return Template.instance().bits.get();
    

  


Template.map.created = function(){
  var self = this;
  console.log('map rendered.');
  self.bits = new ReactiveVar(["bits not yet processed."]);
  Meteor.neo4j.call('allBits',{},function(error,data) {
    // if (error)
      // console.log(error);
    // else 
      // console.log(error,data);
      console.log(data['a']);
      self.bits.set(data['a']);
  });
};


Template.map.rendered = function(){
  
  sound.play('welcome-v1.mp3');

};

Template.map.events({
  'dblclick .map': function (event, template){
    event.preventDefault();
    event.stopPropagation();

    console.log("bit:text:create");
//TODO: put
    // if(event.target.classList.contains('map')){
    //   var id = Bits.insert( { 
    //               content: '',
    //               type: 'text', 
    //               color: 'white',
    //               position_x: event.pageX, 
    //               position_y: event.pageY });
// 
      // Session.set('bitEditingId', id);

    }
  // }
  

});
