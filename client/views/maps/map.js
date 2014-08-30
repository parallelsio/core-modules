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
    origin: [0.0, 0.0]
  });

  mainContext = mainContext.add(originMod);

  // Surfaces are the basic "divs" of the Famous rendering engine.
  // They take a size array, a content string, a CSS classes array
  // and a CSS properties object.
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

  var count = 0;

  Bits.find().forEach(function (bit) {
    
    console.log(bit._id, ":", "x:", bit.position_x, "y:", bit.position_y, ":", bit.type);
    count += 1;
    var bitSurface;

    if (bit.type === "text")
    {
      bitSurface = new Surface({
        size: [300, 100],
        classes: ['bit', 'text'],
        properties: {
          backgroundColor: 'hsla(' + ((count * 5 + count) * 10 % 360) + ', 60%, 55%, 0.8)',
          color: 'white',
          lineHeight: '100px',
          textAlign: 'center'
        },
        content: bit.content
      });
    }

    else if (bit.type === "image")
    {
      bitSurface = new ImageSurface({
        size: [300, 100],
        classes: ['bit','image'],
        properties: {
          backgroundColor: 'hsla(' + ((count * 5 + count) * 10 % 360) + ', 60%, 55%, 0.8)',
        },
        content: "images/" + bit.filename
      });
    }

    else {
      console.log('error: cant bit with no type (image, text, ?)');
    }

    // console.log(bitSurface.content);

    var stateModifier = new StateModifier({
      transform: Transform.translate(bit.position_x, bit.position_y, 0)
    });

    mainContext.add(stateModifier).add(bitSurface);

    bitSurface.on('click', function() {
      console.log(this.content);
    });


    surfaces.push(bitSurface);

  });




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
