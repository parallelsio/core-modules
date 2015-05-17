Meteor.startup(function(){

  // overriding link rendering provided by the Marked package lib,
  // so that we can attach a target='_blank' attribute to each link rendered
  // UX doesnt make sense in our app to open in the same window.

  // technique comes from https://github.com/chjj/marked/issues/144 comment
  // TODO/OQ: does this technique override the Marked library's prototype,
  // which sanitizes as well, based on an options param? Is this safe?
  
  // original prototype function here:
  // https://github.com/chjj/marked/blob/49b7eaca76d14ccd91f87decc11bbe213a6e0af4/lib/marked.js

  var renderer = new marked.Renderer();
  renderer.link = function(href, title, text) {
      var link = marked.Renderer.prototype.link.call(this, href, title, text);
      return link.replace("<a","<a target='_blank' ");
  };

  marked.setOptions({
    renderer: renderer,
    gfm: true,
    tables: false,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: true
  });

});



