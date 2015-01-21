/*
 * Copyright 2011 Gildas Lormeau
 * contact : gildas.lormeau <at> gmail.com
 *
 * This file is part of SingleFile Core.
 *
 *   SingleFile Core is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Lesser General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   SingleFile Core is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Lesser General Public License for more details.
 *
 *   You should have received a copy of the GNU Lesser General Public License
 *   along with SingleFile Core.  If not, see <http://www.gnu.org/licenses/>.
 */

var wininfo = {};

(function() {

  var EXT_ID = "wininfo";

  var contentRequestCallbacks, executeSetFramesWinIdString = executeSetFramesWinId.toString(), processLength, processIndex, timeoutProcess, timeoutInit;

  function addListener(onMessage) {
    function windowMessageListener(event) {
      var data = event.data;
      if (typeof data === "string" && data.indexOf(EXT_ID + "::") == 0)
        onMessage(JSON.parse(data.substr(EXT_ID.length + 2)));
    }
    this.addEventListener("message", windowMessageListener, false);
  }

  function executeSetFramesWinId(extensionId, index, winId) {
    function execute(extensionId, elements, index, winId, win) {
      console.log('wininfo:executeSetFramesWinId:execute:');
      console.log(win);
      var i, framesInfo = [], stringify = JSON.stringify || JSON.encode, parse = JSON.parse || JSON.decode;

      function getContentFrame(frame) {
        if (frame.src.indexOf('chrome-extension') == 0) {
          return null;
        } else {
          return frame.contentDocument;
        }
      }

      function getDoctype(doc) {
        var docType = doc.doctype, docTypeStr;
        if (docType) {
          docTypeStr = "<!DOCTYPE " + docType.nodeName;
          if (docType.publicId) {
            docTypeStr += " PUBLIC \"" + docType.publicId + "\"";
            if (docType.systemId)
              docTypeStr += " \"" + docType.systemId + "\"";
          } else if (docType.systemId)
            docTypeStr += " SYSTEM \"" + docType.systemId + "\"";
          if (docType.internalSubset)
            docTypeStr += " [" + docType.internalSubset + "]";
          return docTypeStr + ">\n";
        }
        return "";
      }

      function addListener(onMessage) {
        function windowMessageListener(event) {
          var data = event.data;
          if (typeof data === "string" && data.indexOf(extensionId + "::") == 0)
            onMessage(parse(data.substr(extensionId.length + 2)));
        }
        top.addEventListener("message", windowMessageListener, false);
      }

      for (i = 0; i < elements.length; i++) {
        framesInfo.push({
          sameDomain : getContentFrame(elements[i]) != null,
          src : elements[i].src,
          winId : winId + "." + i,
          index : i
        });
      }
      if (win != top) {
        console.log('wininfo:executeSetFramesWinId:execute: win != top send initResponse');
        console.log(top);
        win.postMessage(extensionId + "::" + stringify({
          initResponse : true,
          winId : winId,
          index : index
        }), "*");
      }

      console.log('wininfo:executeSetFramesWinId:execute: send initResponse');
      top.postMessage(extensionId + "::" + stringify({
        initResponse : true,
        frames : framesInfo,
        winId : winId,
        index : index
      }), "*");
      for (i = 0; i < elements.length; i++)
        (function(index) {
          var frameElement = elements[i], frameWinId = winId + "." + index, frameDoc = getContentFrame(frameElement);

          function onMessage(message) {
            if (message.getContentRequest) {
              var customEvent, doctype;
              if (message.winId == frameWinId) {
                doctype = getDoctype(frameDoc);
                top.postMessage(extensionId + "::" + stringify({
                  getContentResponse : true,
                  contentRequestId : message.contentRequestId,
                  winId : frameWinId,
                  content : doctype + frameDoc.documentElement.outerHTML,
                  title : frameDoc.title,
                  baseURI : frameDoc.baseURI,
                  url : frameDoc.location.href,
                  characterSet : "UTF-8"
                }), "*");
              }
            }
          }

          if (frameDoc && top.addEventListener) {
            execute(extensionId, frameDoc.querySelectorAll("iframe, frame"), index, frameWinId, frameElement.contentWindow);
            addListener(onMessage);
          } else {

            var frameContent = getContentFrame(frameElement);
            console.log('wininfo:executeSetFramesWinId:execute: set frameContent');
            if (frameContent) {
              console.log('wininfo:executeSetFramesWinId:execute: frameContent');
              frameContent.postMessage(extensionId + "::" + stringify({
                initRequest : true,
                winId : frameWinId,
                index : index
              }), "*");
            }
          }
        })(i);
    }
    execute(extensionId, document.querySelectorAll("iframe, frame"), index, winId, window);
  }

  function getContent(frame, callback) {
    if (frame.sameDomain) {
      contentRequestCallbacks.push(callback);
      top.postMessage(EXT_ID + "::" + JSON.stringify({
        getContentRequest : true,
        winId : frame.winId,
        contentRequestId : contentRequestCallbacks.length - 1
      }), "*");
    } else
      callback({});
  }

  function getContentResponse(message) {
    var id = message.contentRequestId;
    delete message.contentRequestId;
    delete message.getContentResponse;
    contentRequestCallbacks[id](message);
  }

  function initRequest(message) {
    wininfo.winId = message.winId;
    wininfo.index = message.index;
    timeoutInit = setTimeout(function() {
      initResponse({
        initResponse : true,
        frames : [],
        winId : message.winId,
        index : message.index
      });
    }, 3000);
    location.href = "javascript:(" + executeSetFramesWinIdString + ")('" + EXT_ID + "'," + wininfo.index + ",'" + wininfo.winId + "'); void 0;";
  }

  function initResponse(message) {
    console.log('wininfo:initResponse:');
    console.log(message);
    function process() {
      wininfo.frames = wininfo.frames.filter(function(frame) {
        return frame.winId;
      });
      chrome.extension.sendMessage({
        initResponse : true,
        processableDocs : wininfo.frames.length + 1
      });
    }

    if (timeoutInit) {
      clearTimeout(timeoutInit);
      timeoutInit = null;
    }
    if (window == top) {
      console.log('wininfo:initResponse: window == top');
      if (message.frames) {
        console.log('wininfo:initResponse: message.frames = ');
        console.log(message.frames);
        message.frames = message.frames instanceof Array ? message.frames : JSON.parse(message.frames);
        wininfo.frames = wininfo.frames.concat(message.frames);
        processLength += message.frames.length;
        if (message.winId != "0")
          processIndex++;
        if (timeoutProcess) {
          console.log('wininfo:initResponse: clear timeoutProcess');
          clearTimeout(timeoutProcess);
        }
        if (processIndex == processLength) {
          console.log('wininfo:initResponse: calling process');
          process();
        }
        else
          timeoutProcess = setTimeout(function() {
            console.log('wininfo:initResponse: in timeout calling process');
            process();
          }, 200);
      }
    } else {
      console.log('wininfo:initResponse: window != top');
      wininfo.winId = message.winId;
      wininfo.index = message.index;
    }
  }

  function onExtensionMessage(message) {
    if (message.initRequest && document.documentElement instanceof HTMLHtmlElement) {
      console.log('wininfo:onExtensionMessage: calling initRequest');
      contentRequestCallbacks = [];
      processLength = 0;
      processIndex = 0;
      timeoutProcess = null;
      wininfo.frames = [];
      initRequest(message);
    }
  }

  function onWindowMessage(message) {
    if (message.initRequest) {
      console.log('wininfo:onWindowMessage: message.initRequest');
      initRequest(message);
    }
    if (message.initResponse) {
      console.log('wininfo:onWindowMessage: message.initResponse');
      initResponse(message);
    }
    if (message.getContentResponse) {
      console.log('wininfo:onWindowMessage: message.getContentResponse');
      getContentResponse(message);
    }
  }

  if (window == top) {
    wininfo.getContent = getContent;
    chrome.extension.onMessage.addListener(onExtensionMessage);
  }
  addEventListener("contextmenu", function() {
    window.contextmenuTime = (new Date()).getTime();
  }, false);
  addListener(onWindowMessage);

})();
