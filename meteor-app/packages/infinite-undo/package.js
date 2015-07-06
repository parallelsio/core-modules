Package.describe({
  name: "angelcabo:infinite-undo",
  version: "0.0.1",
  summary: "Adds a command design pattern coupled with event sourcing for infinite undo/redo capability in a Meteor App",
  git: "",
  documentation: "README.md"
});

Npm.depends({
  "sourced": "0.0.14",
  "sourced-repo-mongo": "0.3.2",
  "eventemitter2": "0.4.14"
});

Package.onUse(function(api) {
  api.versionsFrom("1.1.0.2");
  api.use(["underscore"]);

  api.addFiles([
    "main.js",
    "lib/rollback-replay-stack.js",
    "lib/entity-repository.js",
    "lib/command-registry.js"
  ], "server");

  api.export("InfiniteUndo", "server");
});

Package.onTest(function(api) {
  api.use(["tinytest", "underscore"]);
  api.use("angelcabo:infinite-undo");
  api.addFiles("test/integration/entity-repository_tests.js", "server");
  api.addFiles("test/integration/rollback-replay-stack_tests.js", "server");
});
