var _ = require('lodash');
var fs = require('fs');
var events = require('./meteor-app/private/tmp/canvas.events.json');

var filtered = _.filter(events, function (e) {
  return e.data._id === 'mQfnLHASj9bC4fyYL';
});

console.log(_.map(filtered, function (e) { return e.method + ', version: ' + e.version}));

var outputFilename = './meteor-app/private/data-backups/canvas.events.filtered.json';

fs.writeFile(outputFilename, JSON.stringify(filtered, null, 2), function(err) {
  if(err) {
    console.log(err);
  } else {
    console.log("JSON saved to " + outputFilename);
  }
});
