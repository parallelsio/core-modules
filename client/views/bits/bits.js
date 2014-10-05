
Template.bit.rendered = function() {

  var element = document.querySelector("[data-id='" + this.data._id + "']");

  // Display bits in coordinate space using transform: translate3d(), with gpu offloading
  // Technique 1: Via GreenSock
  // TweenMax.set(element, { 
  //   x: this.data.position_x,
  //   y: this.data.position_y,
  //   force3D:true 
  // });

  // Technique 2: Manually. Force Z index for GPU Hardware Acceleration
  transformString =  "translate3d(" + this.data.position_x + "px, " + this.data.position_y + "px, 0.01px)";
  element.style.transform = transformString;
  element.css({transform: transformString});
  
  /*
      exploring 4 ways to position bits from worst to best
      http://www.html5rocks.com/en/tutorials/speed/high-performance-animations
      ******************************************************

        1) layout positioning (eh) : 
                
                http://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/
                http://blog.tumult.com/2013/02/28/transform-translate-vs-top-left
                top: 20px; left: 20px;
           

        2) 2D transforms: (better) :

                transform:  translate(150px,150px); # a single transform function

                ---- or -----
                
                matrix transform combines all the 2D transform functions 
                (translate, rotate, skew, scale), in the form of a 3×3 
                linear transformation matrix
                
                transform: matrix(1, 0, 0, 1, 150, 150); # only 6 values are used
                
                http://www.sitepoint.com/advanced-css3-2d-and-3d-transform-techniques
                http://www.eleqtriq.com/wp-content/static/demos/2010/css3d/matrix2dexplorer.html
                http://www.w3.org/TR/css3-transforms/#mathematical-description
            
        3) 3D transforms (even better):

              https://dev.opera.com/articles/understanding-3d-transforms
              https://desandro.github.io/3dtransforms/docs/introduction.html

                  transform: perspective( 600px );     # activate 3D

                  transform: rotate3d( tx, ty, tz )    # a single function in short form
                  ---- or -----
                  transform: rotateX( angle )          # a single function in long form
                  transform: rotateY( angle )
                  transform: rotateZ( angle )
              
              ----------- or --------------------
                 
                  combine all the 3D transform functions 
                  (translate, rotate, skew, scale), in the form of a 4×4 
                  linear transformation matrix:
            
                  transform: matrix3d(m00, m01, m02, m03,
                                      m10, m11, m12, m13,
                                      m20, m21, m22, m23,
                                      m30, m31, m31, m33)

                  https://dev.opera.com/articles/understanding-the-css-transforms-matrix
                  http://9elements.com/html5demos/matrix3d
                  http://www.eleqtriq.com/wp-content/static/demos/2010/css3d/matrix3dexplorer.html
                  http://www.senocular.com/flash/tutorials/transformmatrix

                  Transforms that have a 3D operation as one of its functions will trigger 
                  hardware compositing (GPU), even when the actual transform is 2D, or not doing 
                  anything at all (such as translate3d(0,0,0)). Hacky, don't depend on it, browsers
                  may reoptimize. 
                  jsperf.com/webkitcssmatrix-vs-translate3d 

                  Note, how you build the object matters:
                  https://twitter.com/greensock/status/335879969907539968

        4) Tween via Greensock (which uses 2D transforms under the hood).
           unless either
           -- the Z is set to 0.1 on the element
              or
           -- force3D: true 
           in which case Greensock will use Matrix3D instead
  */



  // set hooks for loading shimmers/wipe transitions
  this.firstNode.parentNode._uihooks = {

    insertElement: function(node, next) {
      

      console.log('_uihook: moment before bit insert ...');


      // var tl = new TimelineLite({ onComplete:function (){
      //   console.log('done shimmer in');
      // } });

          $(node)
            .css( "display", "none" )
            .insertBefore(next)
            .removeClass('hidden')

            console.log('done inserting bit');

      // TweenLite.to(node, 0.1, {opacity:100});

      // tl.from(node, 0.5, {left:100, opacity:0});
      // tl.from(node, 0.5, {left:-100, opacity:0});
      // t1.to(element, 1, {x:100, y:20, z:300});
 
    },

    removeElement: function(node) {
      console.log('_uihook: moment before bit remove');

      // TODO: add a staggered fadeOut shimmer via Greensock
      $(node).remove();
    }
  };



  // Needs to happen after position set, or else positions 
  // via manual transforms get overwritten by Draggable
  // http://greensock.com/docs/#/HTML5/GSAP/Utils/Draggable
  Draggable.create(Template.instance().firstNode, {
    throwProps:true,
    zIndexBoost:false,
    
    onDragStart:function(event){
      // var sound = new Howl({
      //   urls: ['sounds/aim_buddy_logging_in.mp3']
      // }).play();
    },

    onDragEnd:function( event ) {
      console.log("done dragging.");

      var x = this.endX;
      var y = this.endY;

      var mongoId = this.target.dataset.id;
      console.log(event.type + ": " + mongoId + " : " + x + " : " + y);
      
      Bits.update( mongoId , {
        $set: {
          "position_x": x,
          "position_y": y
        }
      });

      var sound = new Howl({
        urls: ['sounds/glue.mp3']
      }).play();

      return true;
    }
  });



};


Template.bit.events({

  'mouseenter .bit': function (event, template){
    event.preventDefault();
    event.stopPropagation();

    if (event.target.classList.contains('bit')) {
      Session.set('bitHovering', template.data._id);
      console.log("bit:hover:in " + Session.get('bitHovering'));

      // TODO: shimmer on hover
      // TODO: scale
      // TweenLite.to(Template.instance().firstNode, 0.3, { left:"+=10px", ease:Elastic.easeOut});
      // var yoyo = myTimeline.yoyo(); //gets current yoyo state
      // myTimeline.yoyo( true ); //sets yoyo to true
    }
  },

  'mouseleave .bit': function (event, template){
    event.preventDefault();
    event.stopPropagation();

    if (event.target.classList.contains('bit')) {
      Session.set('bitHovering', '');
      console.log("bit:hover:out " + Session.get('bitHovering'));
    }
  },

  'click .bit': function (event, template){

    // TODO: Zelda triforce focus here, zoom sound
    console.log("bit:click: " + this._id);
  },

  'dblclick .bit': function (event, template){
    event.preventDefault();
    event.stopPropagation();

    Session.set('bitEditing',this._id);
    console.log("bit:edit: " + Session.get('bitEditing'));
  },

  'keyup .bit': function (event, template){
    event.stopPropagation();
    event.preventDefault();

    // console.log('bit:key up: key code:' + event.which + ': ');

    if(event.which === 13){
      Bits.update( this._id , {
        $set: { "content": template.find('.editbit').value }
      });

      var sound = new Howl({
        urls: ['sounds/ch-chaing-v2.mp3']
      }).play();

      Session.set('bitEditing',null);
    }

    else if (event.which === 27) {
      console.log('escape key');
      Session.set('bitEditing', null);
    }
  }

});



Template.bit.isEditingThisBit = function() {
  return Session.equals('bitEditing', this._id);
};









