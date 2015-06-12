/*
    NOTE: Due to Meteor Issue #3985: https://github.com/meteor/meteor/issues/3985
    we must put something before the extension, in this filename,
    like: app.browserify.js.
*/

// console.log("browserify-ing teoria.js");

// a package scoped variable, that becomes global in our Meteor app because 
// we explicitly assign this var to api.export() in this local package manifest: package.js
teoria = require('teoria');  // exports a function. This is not the same as Npm.requr
