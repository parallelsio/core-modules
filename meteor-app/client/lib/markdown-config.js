Meteor.startup(function(){

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



