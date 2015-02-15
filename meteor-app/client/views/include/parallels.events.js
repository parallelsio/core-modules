window.PARALLELS = window.PARALLELS || {};

window.PARALLELS.Events = {

  initialize: function () {
    this.topics = {
      all: [
        function (e) {
          console.log(e['message'])
        }
      ]
    };
    this.hOP = this.topics.hasOwnProperty;
  },

  subscribe: function (topic, listener) {
    if (!this.hOP.call(this.topics, topic)) this.topics[topic] = [];
    var index = this.topics[topic].push(listener) - 1;
    return {
      remove: function () {
        delete window.PARALLELS.Events.topics[topic][index];
      }
    };
  },

  publish: function (topic, info) {
    if (!this.hOP.call(this.topics, topic)) {
      this.publish('all', info)
    } else {
      this.topics[topic].forEach(function (item) {
        item(info != undefined ? info : {});
      });
      if (topic !== 'all') this.publish('all', info);
    }

  }

};

window.PARALLELS.Events.initialize();
