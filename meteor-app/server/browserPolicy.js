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
  'platform.twitter.com/widgets',
  'cdn.syndication.twitter.com',
  'placehold.it'
];

_.each(trusted, function(origin) {
  origin = "https://" + origin;
  BrowserPolicy.content.allowOriginForAll(origin);
});