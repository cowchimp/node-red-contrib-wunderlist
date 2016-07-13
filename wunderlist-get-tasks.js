var WunderlistSDK = require('wunderlist');

module.exports = function(RED) {
  function WunderlistGetTasks(n) {
    RED.nodes.createNode(this, n);
    var node = this;

    this.config = RED.nodes.getNode(n.config);
    if (!this.config) {
      this.error(RED._('Wunderlist account is not configured'));
    }
    this.wunderlistAPI = new WunderlistSDK({
      'clientID': this.config.clientId,
      'accessToken': this.config.accessToken
    });

    this.on('input', function(msg) {
      var tasks = this.wunderlistAPI.http.tasks;

      tasks.forList(Number(n.listId || msg.payload))
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