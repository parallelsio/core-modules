/*
  We're making a local package of teoria because just including the npm 
  module and having it available on the client side, via cosmos:browserify 
  is ordering it last on Meteor startup. Thus Flocking is failing to declare 
  it's synth definitions, as we use teoria to define our frequency values. 

  By making teora a Meteor package, we dont need to worry about source ordering,
  and when flocking init's we know teoria will already have been defined.

  teora has an npm package already published, and we could use Meteor's built 
  in method for getting NPM packages into our Meteor package 
  BUT
  this only would allow access to the teoria lib on the server side of Meteor.
  To have it available on client side, we can use Meteor's package 
  of browserify, which allows us to use+include npm on the client side,
  and here as well: inside of Meteor packages.
  To do so, we create the teoria.browserify.js. There we instantiate the teoria object, 
  and then set that var to global app scope via the api.export function

  TODO: make Flocking a local package, add teoria as a dependancy for it

  TODO: publish this to: https://github.com/MeteorPackaging/teoria

  REFERENCES: 
    https://trello.com/c/xsl4u3vU/324-split-sound-into-meteor-package
    http://themeteorchef.com/recipes/writing-a-package

*/ 

Package.describe({
  name: 'lifeinchords:teoria',
  version: '0.0.1',
  summary: 'Meteor wrapper for teoria, which provides music theory objects: notes, chords, scales + intervals',

  // local package
  git: '',

  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});


// Declare NPM modules for Meteor to download into .npm/package
Npm.depends({
  'teoria':'1.9.0'  
});




Package.onUse(function(api) {

  // OQ: is this necessary? 
  // TODO: check if this version # updates automatically, when `meteor update` is run to upgrade Meteor version
  api.versionsFrom('1.1.0.2');  
 
  // since we havent added any custom logic to 'Meteorize' the original teoria lib
  // we dont need any Meteor packages via api.use here
  // Full list of available Meteor packages we can use: 
  // https://github.com/meteor/meteor/tree/devel/packages
  // api.use(['minimongo', 'mongo-livedata', 'templating'], 'client'); 

  api.use(['cosmos:browserify@0.3.0'], 'client'); 

  api.addFiles([
    'teoria.browserify.js'
    ],
    'client'
  );
  
  // OQ: Discover Meteor book has this conditional. Why?
  // if (api.export){
  //    api.export('teoria');
  // }

  // export it to global app scope
  api.export('teoria', 'client');

});

// TODO: write tests
// Package.onTest(function(api) {
//   api.use('tinytest');
//   api.use('lifeinchords:teoria');
//   api.addFiles('teoria-tests.js');
// });


