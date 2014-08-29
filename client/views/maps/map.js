Template.map.helpers({
  bits: function() {
    return Bits.find();
  }
});


Template.map.rendered = function() {

  // http://famous.vararu.org
  // https://github.com/tvararu/meteor-famous-playground/tree/master/client/views
  // Read more about the Render Tree here: https://famo.us/guides/dev/render-tree.html

  // Adds the `.famous-container` div to the <body> element, sets the
  // fpsCap to 60, and starts the render loop.
  // You can pass options to change any/all of these.
  var mainContext = Engine.createContext();

  var originMod = new Modifier({
    origin: [0.5, 0.5]
  });

  mainContext = mainContext.add(originMod);

  // Surfaces are the basic "divs" of the Famous rendering engine.
  // They take a size array, a content string, a CSS classes array
  // and a CSS properties object.
  // All optional, and redefinable (`setContent` et al).
  // Surfaces do not know or care about their opacity, position, or rotation.
  // That's the job of Modifiers.
  var surfaces = [];

  var myLayout = new Deck({
    itemSpacing: 10,
    transition: {
      method: 'spring',
      period: 300,
      dampingRatio: 0.5
    },
    stackRotation: 0.1
  });

  myLayout.sequenceFrom(surfaces);

  // TODO: use underscore
  for (var i = 0; i < Bits.find().count(); i++) {
    var bit = new Surface({
      // 'undefined' causes the surface to stretch over the
      // entire available length.
      size: [300, 100],
      classes: ['bit'],
      properties: {
        backgroundColor: 'hsla(' + ((i*5 + i) * 10 % 360) + ', 60%, 55%, 0.8)',
        color: 'white',
        lineHeight: '100px',
        textAlign: 'center'
      },
      content: i + 1
    });

    bit.on('click', function() {
      console.log(this.content);
    });

    surfaces.push(bit);
  }

  mainContext.add(myLayout);

  // Trigger the layout whenever the collection updates in any way.
  Bits.find().observe({
    
    changed: function() {
      myLayout.toggle();
    }
  });


};



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
