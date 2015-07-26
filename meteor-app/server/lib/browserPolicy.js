BrowserPolicy.framing.disallow();
BrowserPolicy.content.disallowInlineScripts();

// TODO: enabled because of Snap.SVG. Can we just whitelist this lib? Open issue?
// enabled because getting similar errors to https://github.com/Urigo/angular-meteor/issues/207
BrowserPolicy.content.allowEval();

BrowserPolicy.content.allowInlineStyles();
BrowserPolicy.content.allowFontDataUrl();

var trusted = [
  process.env.AWS_BUCKET + '.s3.amazonaws.com',
  
  'fonts.gstatic.com',
  'fonts.googleapis.com',
  'placeholdit.imgix.net',

  'localhost:9000'
];

_.each(trusted, function(origin) {
  BrowserPolicy.content.allowOriginForAll("https://" + origin);
  BrowserPolicy.content.allowOriginForAll("http://" + origin);
});