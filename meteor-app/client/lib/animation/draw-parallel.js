// drag handles
// // http://codepen.io/chrisgannon/pen/RNdrJw
// var container = document.getElementById('container');

// var bezierPoint = document.getElementById('null-object');
// var p0NullObject = document.getElementById('p0-null-object');
// var p1NullObject = document.getElementById('p1-null-object');
// var containerNullObject = document.getElementById('container-null-object');

// var lineSVGNode = document.getElementById('line-svg-node');
// var l0 = document.getElementById('l0');
// var p0 = document.getElementById('p0');
// var p1 = document.getElementById('p1');

// var dragSpeed = 0;
// var gravity = 550;
// var lineLength = 200;

// TweenMax.set(container, {
//   position:'absolute',
//   top:'50%',
//   left:'50%',
//   xPercent:-50,
//   yPercent:-50
// })

// TweenMax.set([p0, p1], {
//   position:'absolute',
//   scale:1
// })

// TweenMax.set(bezierPoint, {
//   position:'absolute',
//   x:300,
//   y:400
// })
// TweenMax.set(p0NullObject, {
//   position:'absolute',
//   x:100,
//   y:200
// })
// TweenMax.set(p1NullObject, {
//   position:'absolute',
//   x:300,
//   y:100
// })
// p0Dragger = Draggable.create(p0NullObject, {
//   trigger:p0,
//   type:'x, y',
//   bounds:{minX:0, maxX:window.innerWidth, minY:0, maxY:window.innerHeight},
//   throwProps:true,
//   onDrag:point0Update,
//   onThrowUpdate:point0Update,
//   onRelease:checkLineStretch
// })
// p1Dragger = Draggable.create(p1NullObject, {
//   trigger:p1,
//   type:'x, y',
//   bounds:{minX:0, maxX:window.innerWidth, minY:0, maxY:window.innerHeight},
//   throwProps:true,
//   onDrag:point1Update,
//   onThrowUpdate:point1Update,
//   onRelease:checkLineStretch//,
//   //ease:Elastic.easeOut//,
//   //snap:{x:[400], y:[300]}
// })
// Draggable.create(bezierPoint, {
//   trigger:l0,
//   type:'x,y',
//   throwProps:true,
//   ease:Elastic.easeOut,
//   snap:{x:[300], y:[300]}
// })


// TweenMax.ticker.addEventListener('tick', updateLine);


// function point0Update(e){
  
  
//     //move point0
//     TweenMax.set(p0, {
//       attr:{cx:p0NullObject._gsTransform.x,
//             cy:p0NullObject._gsTransform.y
//            }
//     })
    
//   p0cX = p0NullObject._gsTransform.x;   
//   p0cY = p0NullObject._gsTransform.y;     
//   p1cX = p1NullObject._gsTransform.x;   
//   p1cY = p1NullObject._gsTransform.y;     

  
// }

// function point1Update(e){
  
//   //var target = e.target;
//     //move point1
//     TweenMax.set(p1, {
//       attr:{cx:p1NullObject._gsTransform.x,
//             cy:p1NullObject._gsTransform.y
//            }
//     })
    
//   p0cX = p0NullObject._gsTransform.x;   
//   p0cY = p0NullObject._gsTransform.y;     
//   p1cX = p1NullObject._gsTransform.x;   
//   p1cY = p1NullObject._gsTransform.y;     
    

// }

// function updateLine(){
  
//   var bezierDiffX = Math.abs(p0NullObject._gsTransform.x - p1NullObject._gsTransform.x )/2;

//   var bezierOffsetX = Math.min(p0NullObject._gsTransform.x , p1NullObject._gsTransform.x ) + bezierDiffX;
  
//   var bezierOffsetY = Math.min(p0NullObject._gsTransform.y , p1NullObject._gsTransform.y ) + (lineLength - (bezierDiffX*2)) ;
  
//   var distanceX = Math.abs(p0NullObject._gsTransform.x - p1NullObject._gsTransform.x)
//   var distanceY = Math.abs(p0NullObject._gsTransform.y - p1NullObject._gsTransform.y)
//   var lineDistance = getLineDistance(p0NullObject._gsTransform, p1NullObject._gsTransform)
  
//   var splitDistanceX = Math.min(p0NullObject._gsTransform.x , p1NullObject._gsTransform.x ) + distanceX/2 ;  
//   var splitDistanceY = Math.min(p0NullObject._gsTransform.y , p1NullObject._gsTransform.y ) + distanceY/2 ;  
  


//   bezierOffsetY = (lineDistance < lineLength) ? bezierOffsetY : splitDistanceY;

//   TweenMax.to(bezierPoint, 0.08, {
//     x:bezierOffsetX,
//     y:bezierOffsetY,
//     ease:Power1.easeIn
//   });
  
//   nullX = bezierPoint._gsTransform.x;
//   nullY = bezierPoint._gsTransform.y;
  
//   TweenMax.set(l0, {
//     attr:{d:"M" + p0cX + "," +p0cY +" Q" + nullX + "," + nullY + " " + p1cX + ","+ p1cY  }
//   })  
  
  
// }

// function initPoints(){
//     TweenMax.set(p0, {
//       attr:{cx:p0NullObject._gsTransform.x,
//             cy:p0NullObject._gsTransform.y
//            }
//     })  
//       TweenMax.set(p1, {
//       attr:{cx:p1NullObject._gsTransform.x,
//             cy:p1NullObject._gsTransform.y
//            }
//     })  
//   point0Update();
//   point1Update();
//   updateLine();
// }

// window.onresize = function(){
//   //console.log(p0Dragger)
//   p0Dragger[0].vars.bounds.maxX = window.innerWidth;
//   p0Dragger[0].vars.bounds.maxY = window.innerHeight;
 
//   p1Dragger[0].vars.bounds.maxX = window.innerWidth;
//   p1Dragger[0].vars.bounds.maxY = window.innerHeight;
  
//     p0Dragger[0].update(true); 
//   p1Dragger[0].update(true);
// }

// function getLineDistance( point1, point2 )
// {
//   var xs = 0;
//   var ys = 0;
 
//   xs = point2.x - point1.x;
//   xs = xs * xs;
 
//   ys = point2.y - point1.y;
//   ys = ys * ys;
 
//   return Math.sqrt( xs + ys );
// }

// function checkLineStretch(){
//     if(getLineDistance(p0NullObject._gsTransform, p1NullObject._gsTransform) > lineLength){
      
      
//     }
//   }
// initPoints();

// var tl = new TimelineMax({repeat:1, yoyo:true});

// tl.to(p0NullObject, 1, {
  
//   x:400,
//   onUpdate:point0Update
// })

// .to(p1NullObject, 1, {
  
//   x:500,
//   onUpdate:point1Update
// })

// .to(p0NullObject, 1, {
  
//   x:600,
//   onUpdate:point0Update
// })

// .to(p1NullObject, 1, {
  
//   x:700,
//   onUpdate:point1Update
// })
