function save_options() {
  var server = document.getElementById('server').value;
  chrome.storage.sync.set({
    parallelsServer: server
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Server configuration saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    parallelsServer: 'makeparallels.herokuapp.com'
  }, function(config) {
    document.getElementById('server').value = config.parallelsServer;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
