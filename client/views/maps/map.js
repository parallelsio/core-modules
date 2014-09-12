Template.map.helpers({
  bits: function() {
    return Bits.find();
  }
});





Template.map.rendered = function() {

  // Adds the `.famous-container` div to the <body> element, sets the
  // fpsCap to 60, and starts the render loop.
  var context = Engine.createContext();

  var originModifier = new Modifier({
      origin: [0.2, 0.35]
  });

  context = context.add(originModifier);

  // Surfaces are the basic "divs" of the Famous rendering engine.
  // They take a size array, a content string, a CSS classes array
  // and a CSS properties object.
  // Surfaces do not know or care about their opacity, position, or rotation.
  // That's the job of Modifiers.
  var surfaces = [];

  // var cluster = new Deck({
  //   itemSpacing: 10,
  //   transition: {
  //     method: 'spring',
  //     period: 300,
  //     dampingRatio: 0.5
  //   },
  //   stackRotation: 0.2
  // });

  // cluster.sequenceFrom(surfaces);

  var counter = 0;

  // get the collection of Bits
  // create surfaces out of each and wire up with its events
  Bits.find().forEach(function (bit) {
    
    console.log(bit._id, ":", "x:", bit.position_x, "y:", bit.position_y, ":", bit.type);
    counter += 1;
    var bitSurface;

    if (bit.type === "text")
    {
      bitSurface = new Surface({
        size: [300, 100],
        classes: ['bit', 'text'],
        properties: {

          // TODO: store color in db, assign color on bit:create
          backgroundColor: 'hsla(' + ((counter * 5 + counter) * 10 % 360) + ', 60%, 55%, 0.8)',
          color: 'white',
          lineHeight: '100px',
          textAlign: 'center'
        },
        content: bit.content,

        // assign it the db ID
        // so we can track events and link other 
        // UI actions to this bit
        mongoId: bit._id
      });
    }

    else if (bit.type === "image")
    {

      bitSurface = new ImageSurface({
        // TODO: remove hard coding
        // handle standard sizing when images are dragged/saved to db
        size: [250, bit.nativeHeight / 4],
        classes: ['bit','image'],
        content: "images/1000/" + bit.filename + ".jpg",
        mongoId: bit._id
      });
    }

    else {
      console.log('error: cant bit with no type (image, text, ?)');
    }
    var transitionableTransform = new TransitionableTransform();
    var modifierChain = new ModifierChain();

    var modifierOne = new Modifier({
        transform: Transform.translate(bit.position_x, bit.position_y, 0),
    });

    var modifierTwo = new Modifier({
        transform: transitionableTransform
    });

    modifierChain.addModifier(modifierOne);
    modifierChain.addModifier(modifierTwo);

    // TODO: why is this not affecting the size of the image container?
    // var sizeModifier = new Modifier({
    //     size: [50, 50]
    // });

    // order matters
    context
        .add(modifierChain)
        // .add(sizeModifier)
        .add(bitSurface);


    // wire Events per bit
    bitSurface.on('click', function() {
      console.log('click', bitSurface.mongoId, this.content);
      // cluster.toggle();

    });


    bitSurface.on('mouseover', function() {
      console.log("bit:hover:in " + Session.get('bitHovering'));
      Session.set('bitHovering', bit._id);
      // transitionableTransform.setScale( [ 3, 3 ,1 ], { duration: 250 } );


    });

    bitSurface.on('mouseout', function() {
      console.log("bit:hover:out " + Session.get('bitHovering'));
      Session.set('bitHovering', '');
      // transitionableTransform.setScale( [ 1, 1 ,1 ], { duration: 250 } );
    });


    // surfaces.push(bitSurface);

  });

  // context.add(cluster);

  // Trigger the layout whenever the collection updates in any way.
  // this is a Meteor.observe(), but not working.
  // TODO: when a bit is deleted, why doesn't this update?
  Bits.find().observe({
    
    changed: function() {
      // cluster.toggle();
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
                  content: '',
                  type: 'text', 
                  color: 'white',
                  position_x: event.pageX, 
                  position_y: event.pageY });

      Session.set('bitEditing', id);

      document.querySelector("[data-id='" + id + "']").focus();
    }
  }
  

});
