/*

adapted from:

Particle Emitter JavaScript Library
Version 0.3
by Erik Friend

http://erikfriend.com/jquery.particles/demo.html

- Creates a circular particle emitter of specified 
  radius centered and offset at specified screen location.  
- Particles appear outside of emitter and travel outward at 
  specified velocity while fading until disappearing in specified decay time. 
- Particle size is specified in pixels.  
- Particles reduce in size toward 1px as they decay.  
- A custom image(s) may be used to represent particles. 
- Multiple images will be cycled randomly to create a mix of particle types.

Example:

var emitter = new particleEmitter({
    image: ['resources/particle.white.gif', 'resources/particle.black.gif'],
    center: ['50%', '50%'], offset: [0, 0], radius: 0,
    size: 6, velocity: 40, decay: 1000, rate: 10
}).start();

*/

particleEmitter = function (opts) {

    var defaults = {
        center: ['50%', '50%'],             // center of emitter (x / y coordinates)
        offset: [0, 0],                     // offset emitter relative to center
        radius: 0,                          // radius of emitter circle
        image: 'images/ui/particle.gif',    // image or array of images to use as particles
        size: 1,                            // particle diameter in pixels
        velocity: 10,                       // particle speed in pixels per second
        decay: 500,                         // evaporation rate in milliseconds
        rate: 10                            // emission rate in particles per second
    };

    var _options = $.extend({}, defaults, opts);

    // Constructor
    var _timer, _margin, _distance, _interval, _is_chrome = false;
    (function () {

        // Detect Google Chrome to avoid alpha transparency clipping bug when adjusting opacity
        // if (navigator.userAgent.indexOf('Chrome') >= 0) _is_chrome = true;

        // Convert particle size into emitter surface margin (particles appear outside of emitter)
        _margin = _options.size / 2;
        
        // Convert emission velocity into distance traveled
        _distance = _options.velocity * (_options.decay / 1000);
        
        // Convert emission rate into callback interval
        _interval = 1000 / _options.rate;
    })();

    // PRIVATE METHODS
    var _sparkle = function () {

        // Pick a random angle and convert to radians
        var rads = (Math.random() * 360) * (Math.PI / 180);

        // Starting coordinates
        var sx = parseInt((Math.cos(rads) * (_options.radius + _margin)) + _options.offset[0] - _margin);
        var sy = parseInt((Math.sin(rads) * (_options.radius + _margin)) + _options.offset[1] - _margin);

        // Ending Coordinates
        var ex = parseInt((Math.cos(rads) * (_options.radius + _distance + _margin + 0.5)) + _options.offset[0] - 0.5);
        var ey = parseInt((Math.sin(rads) * (_options.radius + _distance + _margin + 0.5)) + _options.offset[1] - 0.5);

        // Pick from available particle images
        var image;
        if (typeof(_options.image) === 'object') image = _options.image[Math.floor(Math.random() * _options.image.length)];
        else image = _options.image;

        // Attach sparkle to page, then animate movement + evaporation
        // TODO: convert to use two.js for drawing vs GIFs, 
        // and RAF-based animation [vs slower jquery.animate]
        var s = $('<img>')
        .attr('src', image)
        .css({
            position:   'absolute',
            width:      _options.size + 'px',
            height:     _options.size + 'px',
            left:       _options.center[0],
            top:        _options.center[1],
            marginLeft: sx + 'px',
            marginTop:  sy + 'px'
        })
        .prependTo(_options.container)
        .animate({
            width: '1px',
            height: '1px',
            marginLeft: ex + 'px',
            marginTop: ey + 'px',
            opacity: _is_chrome ? 1 : 0
        }, _options.decay, 'linear', function () { 
            $(this).remove(); 
        });

        // Spawn another sparkle
        _timer = Meteor.setTimeout(function () { _sparkle(); }, _interval);
    };

    // PUBLIC INTERFACE
    // This is what gets returned by "new particleEmitter();"
    // Everything above this point behaves as private thanks to closure
    return {
        start:function () {
            Meteor.clearTimeout(_timer);
            _timer = Meteor.setTimeout(function () { _sparkle(); }, 0);
            return(this);
        },
        stop:function () {
            Meteor.clearTimeout(_timer);
            return(this);            
        },
        centerTo:function (x, y) {
            _options.center[0] = x;
            _options.center[1] = y;
        },
        offsetTo:function (x, y) {
            if ((typeof(x) === 'number') && (typeof(y) === 'number')) {
                _options.center[0] = x;
                _options.center[1] = y;
            }
        }
    }
};
