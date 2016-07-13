var WunderlistSDK = require('wunderlist');

module.exports = function(RED) {
  function WunderlistCreateTask(n) {
    RED.nodes.createNode(this, n);
    var node = this;

    this.config = RED.nodes.getNode(n.config);
    if (!this.config) {
      this.error(RED._('Wunderlist account is not configured'));
    }
    this.wunderlistAPI = new WunderlistSDK({
      'accessToken': this.config.accessToken,
      'clientID': this.config.clientId
    });

    this.on('input', function(msg) {
      var tasks = this.wunderlistAPI.http.tasks;

      tasks.create({
        'list_id': Number(n.listId || msg.listId),
        'title': n.taskTitle || msg.payload
      })
      .done(function (taskData, statusCode) {
        msg.taskId = taskData.id;
        node.send(msg);
      })
      .fail(function (resp, code) {
        node.error(resp || 'Wunderlist API error');
      });
    });
  }
  RED.nodes.registerType('wunderlist-create-task', WunderlistCreateTask);
};