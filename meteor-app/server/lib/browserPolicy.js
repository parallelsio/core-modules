BrowserPolicy.framing.disallow();
BrowserPolicy.content.disallowInlineScripts();
BrowserPolicy.content.disallowEval();
BrowserPolicy.content.allowInlineStyles();
BrowserPolicy.content.allowFontDataUrl();

var trusted = [
  process.env.AWS_BUCKET + '.s3.amazonaws.com',

  'fonts.gstatic.com',
  'fonts.googleapis.com',
  'placeholdit.imgix.net',
  'placehold.it',
  'player.vimeo.com',

  'localhost:9000',
  'localhost:3000'
];

_.each(trusted, function(origin) {
  BrowserPolicy.content.allowOriginForAll("https://" + origin);
  BrowserPolicy.content.allowOriginForAll("http://" + origin);
});


// https://stackoverflow.com/questions/32600469/meteor-browser-policy-local-camera-not-allowed
BrowserPolicy.content.allowImageOrigin("blob:");
var constructedCsp = BrowserPolicy.content._constructCsp();
BrowserPolicy.content.setPolicy(constructedCsp +" media-src blob:;");


