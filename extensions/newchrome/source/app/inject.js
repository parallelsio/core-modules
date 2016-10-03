//var processed = false;
//document.addEventListener('webkitvisibilitychange', function() {
//  if (processed) return;
//  processed = true;
//  console.log('webkitvisibilitychange');
//}, false);

//connect();
//sendNativeMessage(document.title);

chrome.runtime.sendMessage({title: document.title}, function(response) {
  if (response) {
    console.log(response);
  }
});
