Package.describe({
  name: "parallels-canvas-manager",
  version: "0.0.1",
  // Brief, one-line summary of the package.
  summary: "",
  // URL to the Git repository containing the source code for this package.
  git: "",
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: "README.md"
});

Package.onUse(function(api) {
  api.versionsFrom("1.1.0.2");
  api.use(["underscore", "angelcabo:infinite-undo"]);

  api.addFiles([
    "main.js",
    "lib/bit.js",
    "lib/canvas.js",
    "lib/canvas-commands/createBitCommand.js",
    "lib/canvas-commands/deleteBitCommand.js",
    "lib/canvas-commands/updateBitContentCommand.js",
    "lib/canvas-commands/updateBitPositionCommand.js",
    "lib/canvas-commands/uploadImageCommand.js",
    "lib/canvas-commands/clipWebpageCommand.js"
  ], "server");

  api.export("ParallelsCanvasManager", "server");
});

Package.onTest(function(api) {
  api.use([
    "tinytest",
    "underscore",
    "angelcabo:infinite-undo",
    "parallels-canvas-manager"
  ]);

  // All test files
  api.addFiles("test/integration/canvas-commands/createBitCommand_tests.js", "server");
});
