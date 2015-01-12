(function() {

  parallels.observer = {};

  var topics = {};
  var hOP = topics.hasOwnProperty;

  parallels.observer.subscribe = function(topic, listener) {
    var that = this;
    if (!hOP.call(topics, topic)) topics[topic] = [];
    var index = topics[topic].push(listener) - 1;
    return {
      remove: function () {
        delete that.topics[topic][index];
      }
    };
  };

  parallels.observer.publish = function(topic, info) {
    if (!hOP.call(topics, topic)) return;
    topics[topic].forEach(function (item) {
      item(info != undefined ? info : {});
    });
  };

})();
