// define('main', function (require, exports, module) {
//   var Engine = require('famous/core/Engine');

//   var Surface = require('famous/core/Surface');
//   var Modifier = require('famous/core/Modifier');
//     var StateModifier = require('famous/modifiers/StateModifier');
//   var Transform = require('famous/core/Transform');
   
//   var Transitionable = require('famous/transitions/Transitionable');
    
//     var TRANSITION = { duration: 200 };
    
//   var mainContext = Engine.createContext();
//     var s = new Surface({
//         size: [100, 100],
//         properties: {
//             background: 'grey'
//         }
//     });
    
//     var scale = new StateModifier();
    
//     var pos = new Transitionable(0);
    
//     var move = new Modifier({
//         origin: [.5, .5],
//         transform: function() {
//             var x = pos.get();
//             return Transform.translate(-100 + x*100, 20, 0);
//         }
//     });
    
//     mainContext.add(move).add(scale).add(s);
    
//     pos.set(1, TRANSITION);
    
//     s.on('mouseover', function() {
//         scale.setTransform(Transform.scale(1.1, 1.1, 1), TRANSITION, _cb);
//     });
    
//     s.on('mouseout', function() {
//         scale.halt();
//         scale.setTransform(Transform.scale(1, 1, 1), TRANSITION, _cb);
//     });
    
//     function _cb() {
//         console.log('cb');
//     }
// });