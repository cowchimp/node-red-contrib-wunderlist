var wunderlistSDK = require('./wunderlist-sdk');

module.exports = function(RED) {
  function WunderlistGetTasks(n) {
    RED.nodes.createNode(this, n);
    var node = this;
    this.config = RED.nodes.getNode(n.config);

    this.on('input', function(msg) {
      var wunderlistAPI = wunderlistSDK.getApi(node.config, msg);
      var tasks = wunderlistAPI.http.tasks;

      tasks.forList(Number(n.listId || msg.payload), (msg.completed || false))
        .done(function (tasksData, statusCode) {
          msg.payload = tasksData;
          node.send(msg);
        })
        .fail(function (resp, code) {
          node.error(resp || 'Wunderlist API error');
        });
    });
  }
  RED.nodes.registerType('wunderlist-get-tasks', WunderlistGetTasks);
};
