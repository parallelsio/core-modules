var
  vm = require("vm"),
  fs = require("fs");

module.exports = function(path, context) {
  context = context || {};
  var data = fs.readFileSync(path);
  vm.runInNewContext(data, context, path);
  return context;
};
