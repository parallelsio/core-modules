BrowserPolicy.framing.disallow();
BrowserPolicy.content.disallowInlineScripts();
BrowserPolicy.content.disallowEval();
BrowserPolicy.content.allowInlineStyles();
BrowserPolicy.content.allowFontDataUrl();

var trusted = [
  '*.s3.amazonaws.com',
  'fonts.gstatic.com',
  'fonts.googleapis.com',

  'makeparallels.herokuapp.com',
  'placehold.it'
];

_.each(trusted, function(origin) {
  BrowserPolicy.content.allowOriginForAll("https://" + origin);
  BrowserPolicy.content.allowOriginForAll("http://" + origin);
});
