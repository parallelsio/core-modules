Template.debug.rendered = function(){

  // Open all links and forms in a new tab
  $('iframe#iframehtml').load(function() {
    var links = window.frames["iframehtml"].contentWindow.document.links;
    for (var i = 0; i < links.length; i++) {
      links[i].target = "_blank";
    }
    var forms = window.frames["iframehtml"].contentWindow.document.forms;
    for (var j = 0; j < forms.length; j++) {
      forms[j].target = "_blank";
    }
  });
};

