'use strict';

const SERVER_KEY = 'parallels:server';
const SERVER_DEFAULT = 'makeparallels.herokuapp.com';
const CANVAS_KEY = 'parallels:canvas';
const CANVAS_DEFAULT = 'demo';

define(['browser'], function (browser) {
  var server, canvas;

  function saveSettingToLocalStorage(key, val) {
    var setting = {};
    setting[key] = val;
    browser.saveLocal(setting);
  }

  return {

    getServer: function (callback) {
      if (!server) {
        browser.getLocal({key: SERVER_KEY, defaultValue: SERVER_DEFAULT}, function (storedData) {
          server = storedData[SERVER_KEY];
          callback(server);
        });
      } else {
        callback(server);
      }
    },

    setServer: function (val) {
      if (server !== val) {
        server = val;
        saveSettingToLocalStorage(SERVER_KEY, val);
        browser.sendMessageToBackground({data: {event: 'server-changed', newValue: server}});
      }
    },

    getCanvas: function (callback) {
      if (!canvas) {
        browser.getLocal({key: CANVAS_KEY, defaultValue: CANVAS_DEFAULT}, function (storedData) {
          canvas = storedData[CANVAS_KEY];
          callback(canvas);
        });
      } else {
        callback(canvas);
      }
    },

    setCanvas: function (val) {
      if (canvas !== val) {
        saveSettingToLocalStorage(CANVAS_KEY, val);
        canvas = val;
      }
    }
  };
});
