define(['lib/htmlParser/background/observer', 'lib/htmlParser/background/bgcore'], function(observer, core) {

  var htmlParser = {};

  var DEFAULT_CONFIG = {
    removeFrames : true,
    removeScripts : true,
    removeObjects : true,
    removeHidden : false,
    removeUnusedCSSRules : false,
    displayProcessedPage : false,
    processInBackground : true,
    maxFrameSize : 2,
    getContent : true,
    getRawDoc : false
  };

  var tabs = [], processingPagesCount = 0, pageId = 0;

  function processInit(tabId, port, message) {
    console.log('background:processInit:');
    observer.publish('bg-init', {data: {
      event: 'bg-init'
    }});
    console.log(message);
    var pageData = tabs[tabId][message.pageId];
    pageData.portsId.push(port.portId_);
    if (!pageData.getDocData(message.winId))
      pageData.processDoc(port, message.topWindow, message.winId, message.index, message.content, message.title, message.url, message.baseURI,
        message.characterSet, message.canvasData, message.contextmenuTime, {
          init : docInit,
          progress : docProgress,
          end : docEnd
        });
  }

  function setContentResponse(tabId, pageId, docData, content) {
    var pageData = tabs[tabId][pageId];
    processingPagesCount--;
    observer.publish('process-end', {data: {
      event: 'process-end',
      processEnd : true,
      pageId : pageId,
      blockingProcess : !pageData.config.processInBackground || pageData.config.displayProcessedPage,
      processingPagesCount : processingPagesCount,
      content : pageData.config.getContent ? content : null,
      url : pageData.url,
      title : pageData.title
    }});
    if (!pageData.config.processInBackground || pageData.config.displayProcessedPage) {
      pageData.processing = false;
      tabs[tabId].processing = false;
    }
    if (pageData.pendingDelete)
      deletePageData(pageData);
  }

  function docInit(pageData, docData, maxIndex) {
    console.log('background:docInit:');
    function pageInit() {
      console.log('background:docInit:pageInit');
      console.log(pageData);
      console.log(docData);
      delete pageData.timeoutPageInit;
      pageData.processableDocs = pageData.initializedDocs;
      pageData.initProcess();
      processingPagesCount++;
      observer.publish('process-start', {data: {
        event: 'process-start',
        processStart : true,
        pageId : pageData.pageId,
        blockingProcess : !pageData.config.processInBackground || pageData.config.displayProcessedPage,
        processingPagesCount : processingPagesCount
      }});
      if (pageData.config.processInBackground && !pageData.config.displayProcessedPage) {
        tabs[pageData.tabId].processing = false;
        pageData.processing = false;
      }
    }

    if (!docData.initialized) {
      console.log('background:docInit: initialize docData');
      docData.initialized = true;
      console.log(pageData);
      if (pageData.initializedDocs != pageData.processableDocs) {
        docData.progressMax = maxIndex;
        pageData.initializedDocs++;
        if (pageData.timeoutPageInit) {
          clearTimeout(pageData.timeoutPageInit);
        }
        console.log('background:docInit: setTimeout 5000ms to wait while frames are collected.');
        pageData.timeoutPageInit = setTimeout(pageInit, 5000);
        if (pageData.initializedDocs == pageData.processableDocs || pageData.processSelection || pageData.config.removeFrames
          || pageData.config.getRawDoc) {
          console.log('background:docInit: clearTimeout for pageData. Explicitly call pageInit()');
          clearTimeout(pageData.timeoutPageInit);
          pageInit();
        }
      }
    }
  }

  function docProgress(pageData, docData, index) {
    var progressIndex = 0, progressMax = 0;
    docData.progressIndex = index;
    tabs.forEach(function(tabData) {
      if (tabData) {
        tabData.progressIndex = 0;
        tabData.progressMax = 0;
        tabData.forEach(function(pageData) {
          if (pageData) {
            pageData.computeProgress();
            tabData.progressIndex += pageData.progressIndex;
            tabData.progressMax += pageData.progressMax;
          }
        });
        progressIndex += tabData.progressIndex;
        progressMax += tabData.progressMax;
      }
    });
    observer.publish('process-progress', {data: {
      event: 'process-progress',
      processProgress : true,
      pageId : pageData.pageId,
      pageIndex : pageData.progressIndex,
      pageMaxIndex : pageData.progressMax,
      tabIndex : tabs[pageData.tabId].progressIndex,
      tabMaxIndex : tabs[pageData.tabId].progressMax,
      index : progressIndex,
      maxIndex : progressMax
    }});
  }

  function docEnd(pageData, docData, content) {
    pageData.setDocContent(docData, content, setContentResponse);
  }

  function process(tabId, config, processSelection, processFrame) {
    console.log('background:process:');
    var pageData, configScript;
    if (processFrame) {
      config.processInBackground = true;
      config.removeFrames = false;
    }
    configScript = {
      event: 'pageRequest',
      opts : JSON.stringify({
        config: config,
        pageId: pageId,
        processSelection: processSelection
      })
    };
    if (tabs[tabId] && tabs[tabId].processing)
      return;
    tabs[tabId] = tabs[tabId] || [];
    tabs[tabId].processing = true;
    console.log(tabs);
    pageData = new core.PageData(tabId, pageId, config, processSelection, processFrame, function() {
      console.log('background:process:executeScripts');
      chrome.tabs.sendMessage(tabId, {data: configScript});
    });
    tabs[tabId][pageId] = pageData;
    pageId++;
  }

  function deletePageData(pageData) {
    delete tabs[pageData.tabId][pageData.pageId];
    tabs[pageData.tabId] = tabs[pageData.tabId].filter(function(pageData) {
      return pageData;
    });
    if (!tabs[pageData.tabId].length)
      delete tabs[pageData.tabId];
  }

  function onConnect(port) {
    var tabId = port.sender.tab.id, portPageId = [];

    function onDisconnect() {
      var pageData = tabs[tabId][portPageId[port.portId_]];
      if (!pageData)
        return;
      pageData.portsId = pageData.portsId.filter(function(id) {
        return id != port.portId_;
      });
      if (!pageData.portsId.length)
        if (pageData.pendingDelete)
          deletePageData(pageData);
        else
          pageData.pendingDelete = true;
      console.log('disconnecting');
    }

    function onMessage(message) {
      console.log('background:onMessage');
      console.log(message);
      var pageData, docData;
      if (message.winId) {
        portPageId[port.portId_] = message.pageId;
        if (message.processInit)
          processInit(tabId, port, message);
        else {
          pageData = tabs[tabId][message.pageId];
          docData = pageData.getDocData(message.winId);
          if (message.processDocFragment)
            pageData.processDocFragment(docData, message.mutationEventId, message.content);
          if (message.getResourceContentRequest)
            pageData
              .getResourceContentRequest(message.url, message.requestId, message.winId, message.characterSet, message.mediaTypeParam, docData);
          if (message.docInit)
            docInit(pageData, docData, message.maxIndex);
          if (message.docProgress)
            docProgress(pageData, docData, message.index);
          if (message.docEnd)
            docEnd(pageData, docData, message.content);
          if (message.setFrameContentResponse)
            docData.children[message.index].setFrameContentCallback();
          if (message.getContentResponse) {
            docData.content = message.content;
            docData.getContentCallback();
          }
          if (message.setContentResponse)
            setContentResponse(tabId, message.pageId, docData, message.content);
        }
      }
    }

    if (port.name == "parallels") {
      port.onMessage.addListener(onMessage);
      port.onDisconnect.addListener(onDisconnect);
    }
  }

  htmlParser.start = function(request) {
    var property, config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    if (request.config)
      for (property in request.config)
        config[property] = request.config[property];
    if (request.processSelection)
      process(request.id, config, true, false);
    else if (request.processFrame)
      process(request.id, config, false, true);
    else if (request.tabIds)
      request.tabIds.forEach(function(tabId) {
        process(tabId, config, false, false);
      });
    else
      process(request.id, config, false, false);
  };

  htmlParser.subscribe = observer.subscribe;

  chrome.extension.onConnect.addListener(onConnect);

  return htmlParser;
});
