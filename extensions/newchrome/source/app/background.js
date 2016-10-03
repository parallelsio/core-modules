//chrome.tabs.onActivated.addListener(function (tab) {
//  console.log('tabs.onActivated', tab.tabId);
//});

var port = null;

function sendNativeMessage(value) {
  var message = {"text": value};
  port.postMessage(message);
  console.log("Sent message: " + JSON.stringify(message));
}

function onNativeMessage(message) {
  console.log("Received message: " + JSON.stringify(message));
}

function onDisconnected() {
  console.log("Failed to connect: " + chrome.runtime.lastError.message);
  port = null;
}

function connect() {
  var hostName = "com.makeparallels.clipper";
  console.log("Connecting to native messaging host " + hostName);
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (port) {
    sendNativeMessage(request.title);
  }
});

connect();
