'use strict';

/**
 * Collect configuration options to use while clipping web bits.
 */
requirejs(['modules/config'],
  function (config) {
    config.getServer(function (server) {
      document.getElementById('server').value = server;
    });

    config.getCanvas(function (canvas) {
      document.getElementById('canvas').value = canvas;
    });

    function saveOptions() {
      config.setServer(document.getElementById('server').value);
      config.setCanvas(document.getElementById('canvas').value);
      var status = document.getElementById('status');
      status.textContent = 'Configuration saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 750);
    }

    document.getElementById('save').addEventListener('click', saveOptions);
  });

