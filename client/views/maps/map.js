Template.map.helpers({
  bits: function() {
    return Bits.find();
  }
});





Template.map.rendered = function() {

  console.log('map rendered.');

  // Adds the `.famous-container` div to the <body> element, sets the
  // fpsCap to 60, and starts the render loop.
  var context = famous.core.Engine.createContext();

  var originModifier = new famous.core.Modifier({
      origin: [0.2, 0.35]
  });

  context = context.add(originModifier);

  // Surfaces are the basic "divs" of the Famous rendering engine.
  // They take a size array, a content string, a CSS classes array
  // and a CSS properties object.
  // Surfaces do not know or care about their opacity, position, or rotation.
  // That's the job of Modifiers.
  var surfaces = [];

  // var cluster = new famous.views.Deck({
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
    
    console.log(meteorBit._id, ":", "x:", meteorBit.position_x, "y:", meteorBit.position_y, ":", meteorBit.type);
    counter += 1;
    var bitSurface;

    if (meteorBit.type === "text")
    {
      bitSurface = new famous.core.Surface({
        size: [300, undefined],
        classes: ['bit', 'text', meteorBit._id],
        content: meteorBit.content,

        // assign it the db ID
        // so we can track events and link other 
        // UI actions to this bit
        mongoId: meteorBit._id
      });
    }

    else if (meteorBit.type === "image")
    {
      bitSurface = new famous.surfaces.ImageSurface({
        // TODO: remove hard coding
        // handle standard sizing when images are dragged/saved to db
        size: [250, meteorBit.nativeHeight / 4],
        classes: ['bit','image', meteorBit._id],
        content: "images/1000/" + meteorBit.filename + ".jpg",
        mongoId: meteorBit._id
      });
    }

    else {
      console.log('error: cant bit with no type (image, text, ?)');
    }

    // TODO: cant use the same transform 2x, refactor
    // http://stackoverflow.com/questions/25197689/why-cant-we-reuse-state-modifiers
    var transitionableTransform = new famous.transitions.TransitionableTransform();
    var modifierChain = new famous.modifiers.ModifierChain();
    var putInPlace = new famous.core.Transform.translate(meteorBit.position_x, meteorBit.position_y, 0);

    var modifierOne = new famous.core.Modifier({
        transform: putInPlace
    });

    var modifierTwo = new famous.core.Modifier({
        transform: transitionableTransform
    });

    modifierChain.addModifier(modifierOne);
    modifierChain.addModifier(modifierTwo);

    // TODO: why is this not affecting the size of the image container?
    // var sizeModifier = new famous.core.Modifier({
    //     size: [50, 50]
    // });

    // order matters here
    context
        .add(modifierChain)
        // .add(sizeModifier)
        .add(bitSurface);


    bitSurface.on('click', function() {
      // 
      // ID : so hacky
      console.log('click', meteorBit._id, meteorBit.content);
      bitSurface.setContent('clicked.');
      // for Cluster
      // cluster.toggle();
    });


    bitSurface.on('mouseover', function() {
      console.log("bit:hover:in " + Session.get('bitHovering'));
      Session.set('bitHovering', meteorBit._id);
      bitSurface.addClass('hover');
    });

    bitSurface.on('mouseout', function() {
      console.log("bit:hover:out " + Session.get('bitHovering'));
      Session.set('bitHovering', '');
      bitSurface.removeClass('hover');
    });


    // for Cluster
    // surfaces.push(bitSurface); 

  });

  // for Cluster
  // context.add(cluster);


  // Trigger the layout whenever the collection updates in any way.
  // this is a Meteor.observe(), but not working.
  // TODO: when a bit is deleted, why doesn't this update?
  Bits.find().observe({
    
    changed: function() {
      bitSurface.setContent("CHANGED");
      // cluster.toggle();
      console.log('bit changed via observe.');
    },

    added: function() {
      bitSurface.setContent("ADDED");
      // cluster.toggle();
      console.log('bit added via observe.');
    }
  });


};



Template.map.events({
  'dblclick .map': function (event, template){
    event.preventDefault();
    event.stopPropagation();

    console.log("bit:text:create");

    if(event.target.classList.contains('map')){
      var id = Bits.insert( { 
                  content: '',
                  type: 'text', 
                  color: 'white',
                  position_x: event.pageX, 
                  position_y: event.pageY });

      Session.set('bitEditing', id);

      // document.querySelector("[data-id='" + id + "']").focus();

      bitSurface = new famous.core.Surface({
        size: [300, 300],
        classes: ['bit', 'text'],
        content: '_______',

        // assign it the db ID
        // so we can track events and link other 
        // UI actions to this bit
        mongoId: id
      });


    }
  }
  

});
