var wunderlistSDK = require('./wunderlist-sdk');

module.exports = function(RED) {
  function WunderlistGetTasks(n) {
    RED.nodes.createNode(this, n);
    var node = this;
    this.config = RED.nodes.getNode(n.config);

    this.on('input', function(msg, send, done) {
      send = send || function() { node.send.apply(node,arguments) };

      var wunderlistAPI = wunderlistSDK.getApi(node.config, msg);
      var tasks = wunderlistAPI.http.tasks;

      tasks.forList(Number(n.listId || msg.payload), (msg.completed || false))
        .done(function (tasksData, statusCode) {
          msg.payload = tasksData;
          send(msg);
          if (done) {
            done();
          }
        })
        .fail(function (resp, code) {
          var err = resp || 'Wunderlist API error';
          if (done) {
            done(err)
          } else {
            node.error(err);
          }
        });
    });
  }
  RED.nodes.registerType('wunderlist-get-tasks', WunderlistGetTasks);
};
