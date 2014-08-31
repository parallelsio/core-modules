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
  var context = Engine.createContext();

    var originModifier = new Modifier({
        origin: [0.0, 0.0]
    });

  context = context.add(originModifier);

  // Surfaces are the basic "divs" of the Famous rendering engine.
  // They take a size array, a content string, a CSS classes array
  // and a CSS properties object.
  // Surfaces do not know or care about their opacity, position, or rotation.
  // That's the job of Modifiers.
  var surfaces = [];

  var mapLayout = new Deck({
    itemSpacing: 0,
    transition: {
      method: 'spring',
      period: 300,
      dampingRatio: 0.5
    },
    stackRotation: 0.1
  });

  mapLayout.sequenceFrom(surfaces);

  var counter = 0;
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
          backgroundColor: 'hsla(' + ((counter * 5 + counter) * 10 % 360) + ', 60%, 55%, 0.8)',
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
        size: [250, bit.nativeHeight / 4],
        classes: ['bit','image'],
        content: "images/1000/" + bit.filename + ".jpg"
      });
    }

    else {
      console.log('error: cant bit with no type (image, text, ?)');
    }

    var stateModifier = new StateModifier({
      transform: Transform.translate(bit.position_x, bit.position_y, 0)
    });

    // TODO: why is this not affecting the size of the image container?
    var sizeModifier = new Modifier({
        size: [50, 50]
    });

    context
        .add(stateModifier)
        .add(sizeModifier)
        .add(bitSurface);

    bitSurface.on('click', function() {
      console.log('click', this._id, this.content);
      mapLayout.toggle();
    });

    // TODO: why is this not working?
    // bitSurface.on('onmouseover', function() {
    //   console.log('onmouseover', this._id, this.content);
    // });


    surfaces.push(bitSurface);

  });




  context.add(mapLayout);

  // Trigger the layout whenever the collection updates in any way.
  // this is a Meteor.observe(), but not working.
  // TODO: when a bit is deleted, why doesn't this update?
  Bits.find().observe({
    
    changed: function() {
      mapLayout.toggle();
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
