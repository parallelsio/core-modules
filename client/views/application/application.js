// RUNS ONLY IN CLIENT

// use lodash instead of underscore
// https://github.com/meteor/meteor/issues/1009
_ = lodash;



Meteor.startup(function(){



  // TODO: move to another file
  var utility = ({

    // create utility
    // var element = document.querySelector("[data-id='" + this.data._id + "']");
    // var getParallelsID = ""



    // http://www.kirupa.com/html5/get_element_position_using_javascript.htm
    getClickPosition: function(e) {
        var parentPosition = getPosition(e.currentTarget);
        var xPosition = e.clientX - parentPosition.x;
        var yPosition = e.clientY - parentPosition.y;
    },

    getPosition: function(element) {
        var xPosition = 0;
        var yPosition = 0;
          
        while (element) {
            xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }
        return { x: xPosition, y: yPosition };
    }

  });




  console.log("Meteor.startup start.");
  
  // TODO: why doesnt JS native selector work here
  // but Jquery does?
  // var elem = document.querySelector('.bit');
  // var elem = $('.bit');
  // console.log(elem);


  // TODO: belong here, or on map?
  Mousetrap.bind("d", function() {

    console.log("pressed d");

    var bitHovering = Session.get('bitHovering');
    console.log();

    if(bitHovering)
    {
      Bits.remove(bitHovering);
      console.log("bit:delete: " + bitHovering);
    }
  });


  Mousetrap.bind("space", function() {
    event.preventDefault();
    event.stopPropagation();

    console.log("pressed spacebar");
    var bitHovering = Session.get('bitHovering');
    console.log();

    if(bitHovering)
    {
      // preview
      console.log("bit:preview: " + bitHovering);
    }
  });

  Mousetrap.bind("shift", function() {
    event.preventDefault();
    event.stopPropagation();
    
    console.log("pressed shift");
    var bitHovering = Session.get('bitHovering');
    console.log();

    if(bitHovering)
    {
      // shift, preview
      console.log("bit:ready for drag: " + bitHovering);

      // TODO: get viewport size
      // merge with zelda animation, as that uses it too
      var screenWidth = window.screen.availWidth;
      var screenHeight = window.screen.availHeight;
      var chromeHeight = screenHeight - (document.documentElement.clientHeight || screenHeight);

      // creates canvas 1000 × 700 at 0, 0
      var r = Raphael(0, 0, 1000, 700);
      var discattr = {fill: "#fff", stroke: "none"};

      var element = document.querySelector("[data-id='" + bitHovering + "']");
      var position = utility.getPosition(element);
      console.log("The image is located at: " + position.x + ", " + position.y);


      var circle = r.circle(position.x, position.y, 5);

      circle.attr({ fill: "blue" });

      
      function drawBezierCurve(x, y, ax, ay, bx, by, zx, zy, color) {

        var path = [["M", x, y], ["C", ax, ay, bx, by, zx, zy]],
            path2 = [["M", x, y], ["L", ax, ay], ["M", bx, by], ["L", zx, zy]],
           
            curve = r.path(path).attr({ stroke: color || Raphael.getColor(), "stroke-width": 10, "stroke-linecap": "round"}),
           
            controls = r.set(
                r.path(path2).attr({stroke: "#ccc", "stroke-dasharray": ". "}),
                r.circle(x, y, 5).attr(discattr),
                r.circle(ax, ay, 5).attr(discattr),
                r.circle(bx, by, 5).attr(discattr),
                r.circle(zx, zy, 5).attr(discattr)
            );

          controls[1].update = function (x, y) {
              var X = this.attr("cx") + x,
                  Y = this.attr("cy") + y;
              this.attr({cx: X, cy: Y});
              path[0][1] = X;
              path[0][2] = Y;
              path2[0][1] = X;
              path2[0][2] = Y;
              controls[2].update(x, y);
          };

          controls[2].update = function (x, y) {
              var X = this.attr("cx") + x,
                  Y = this.attr("cy") + y;
              this.attr({cx: X, cy: Y});
              path[1][1] = X;
              path[1][2] = Y;
              path2[1][1] = X;
              path2[1][2] = Y;
              curve.attr({path: path});
              controls[0].attr({path: path2});
          };

          controls[3].update = function (x, y) {
              var X = this.attr("cx") + x,
                  Y = this.attr("cy") + y;
              this.attr({cx: X, cy: Y});
              path[1][3] = X;
              path[1][4] = Y;
              path2[2][1] = X;
              path2[2][2] = Y;
              curve.attr({path: path});
              controls[0].attr({path: path2});
          };

          controls[4].update = function (x, y) {
              var X = this.attr("cx") + x,
                  Y = this.attr("cy") + y;
              this.attr({cx: X, cy: Y});
              path[1][5] = X;
              path[1][6] = Y;
              path2[3][1] = X;
              path2[3][2] = Y;
              controls[3].update(x, y);
          };

          controls.drag(move, up);
      }

      function move(dx, dy) {
          this.update(dx - (this.dx || 0), dy - (this.dy || 0));
          this.dx = dx;
          this.dy = dy;
      }

      function up() {
          this.dx = this.dy = 0;
      }

      drawBezierCurve(270, 100, 310, 100, 330, 200, 370, 200, "hsb(.3, .75, .75)");



      $(this).mousemove( function(event) {
        var mouse = utility.getPosition();
        console.log("mouse utility: ", mouse.x, mouse.y);
        console.log("mouse event.page_: ", event.pageX, event.pageY);
      });
      
      // tween the fill to blue (#00f) and x to 100, y to 100, 
      // width to 100 and height to 50 over the course of 3 seconds using an ease of Power1.easeInOut
      // TweenLite.to(rect, 3, { raphael:{ fill:"#00f", x:100, y:100, width:100, height:50 }, ease:Power1.easeInOut});


    }
  });


  console.log("Meteor.startup done.");

  Tracker.autorun(function() {
    console.log(Bits.find().count() + ' bits... updated via deps');
  });



});



// keep track of current mouse position
// used when bit:new/create, use mouse position to create bit at that location
// x = 0;
// y = 0;

showNotifications = true;

showNotification = function(message, type) {

  // default to info. other options: success, error, notice
  if (typeof type === "undefined") {
    type = "info";
  }

  console.log(message);
  
};


  