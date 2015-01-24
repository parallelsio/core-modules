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

var callback;

var wininfo = {
  init : function(tabId, cb) {
    callback = cb;
    console.log('background:wininfo:init: send initRequest');
    chrome.tabs.sendMessage(tabId, {
      initRequest : true,
      winId : "0",
      index : 0
    });
  },

  onInitResponse : function(message) {
    if (message.initResponse) {
      console.log('background:wininfo:init: message.initResponse');
      callback(message.processableDocs);
    }
  }
};

chrome.extension.onMessage.addListener(wininfo.onInitResponse);
