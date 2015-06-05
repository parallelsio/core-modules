// // OQ: why is there no scope for running initProton?

// // https://a-jie.github.io/Proton/

// var initProton = function(){

//   var canvas;
//   var context;
//   var proton;
//   var renderer;
//   var emitter;
//   var stats;
//   var mouseObj;
//   var _mousedown = false;
//   var repulsionBehaviour, crossZoneBehaviour;
  
//   canvas = document.getElementById("create-parallel--proton");
//   canvas.width = verge.viewportW();
//   canvas.height = verge.viewportH();
//   context = canvas.getContext('2d');

//   createProton();
//   createRenderer();
//   tick();

//   canvas.addEventListener('mousedown', mousedownHandler, false);
//   canvas.addEventListener('mouseup', mouseupHandler, false);
//   canvas.addEventListener('mousemove', mousemoveHandler, false);

//   window.onresize = function(e) {
//     canvas.width = verge.viewportW();
//     canvas.height = verge.viewportH();
//     crossZoneBehaviour.reset(new Proton.RectZone(0, 0, canvas.width, canvas.height), 'cross');
//   }


//   function createProton() {
//     proton = new Proton;
//     emitter = new Proton.Emitter();
//     emitter.damping = 0.008;
//     emitter.rate = new Proton.Rate(10);
//     emitter.addInitialize(new Proton.Mass(1));
//     emitter.addInitialize(new Proton.Life(0, 10));

//     emitter.addInitialize(new Proton.Radius(4));
//     // emitter.addInitialize(new Proton.Radius(1, 12));

//     emitter.addInitialize(new Proton.Velocity(new Proton.Span(1.5), new Proton.Span(0, 360), 'polar'));

//     mouseObj = {
//       x : 1003 / 2,
//       y : 610 / 2
//     };
//     repulsionBehaviour = new Proton.Repulsion(mouseObj, 0, 0);
//     addrepulsionBehaviours();
//     crossZoneBehaviour = new Proton.CrossZone(new Proton.RectZone(0, 0, canvas.width, canvas.height), 'cross');
//     emitter.addBehaviour(new Proton.Color('random'));
//     emitter.addBehaviour(repulsionBehaviour);
//     emitter.addBehaviour(crossZoneBehaviour);
//     emitter.addBehaviour(new Proton.Alpha(1, 0));
    
//     // emitter position
//     emitter.p.x = canvas.width / 2;
//     emitter.p.y = canvas.height / 2;
    
//     emitter.emit('once');
//     proton.addEmitter(emitter);
//   }

//   function addrepulsionBehaviours() {
//     var total = 12;
//     var d = 360 / total;
//     var R = 230;
//     for (var i = 0; i < 360; i += d) {
//       var x = R * Math.cos(i * Math.PI / 180);
//       var y = R * Math.sin(i * Math.PI / 180);
//       emitter.addBehaviour(new Proton.Attraction({
//         x : x + canvas.width / 2,
//         y : y + canvas.height / 2
//       }, 10, 300));
//     }

//     emitter.addBehaviour(new Proton.Repulsion({
//       x : canvas.width / 2,
//       y : canvas.height / 2
//     }, 20, 300));
//   }

//   function mousedownHandler(e) {
//     _mousedown = true;
//   }

//   function mousemoveHandler(e) {
//     if (_mousedown) {
//       var _x, _y;
//       if (e.layerX || e.layerX == 0) {
//         _x = e.layerX;
//         _y = e.layerY;
//       } else if (e.offsetX || e.offsetX == 0) {
//         _x = e.offsetX;
//         _y = e.offsetY;
//       }

//       mouseObj.x = _x;
//       mouseObj.y = _y;
//       repulsionBehaviour.reset(mouseObj, 30, 500);
//     }
//   }

//   function createRenderer() {
//     renderer = new Proton.Renderer('other', proton);
//     renderer.onProtonUpdate = function() {
//       // context.fillStyle = "rgba(0, 0, 0, 0.2)";
//       // context.fillRect(0, 0, canvas.width, canvas.height);
//     };

//     renderer.onParticleUpdate = function(particle) {
//       context.beginPath();
//       context.strokeStyle = particle.color;
//       context.lineWidth = 5;
//       context.moveTo(particle.old.p.x, particle.old.p.y);
//       context.lineTo(particle.p.x, particle.p.y);
//       context.closePath();
//       context.stroke();
//     };

//     renderer.start();
//   }

//   function mouseupHandler(e) {
//     _mousedown = false;
//     repulsionBehaviour.reset(mouseObj, 0, 0);
//   }

//   function tick() {
//     requestAnimationFrame(tick);
//     proton.update();
//   }
// }


