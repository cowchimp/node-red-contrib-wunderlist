var wunderlistSDK = require('./wunderlist-sdk');

module.exports = function(RED) {
  function WunderlistCreateSubtask(n) {
    RED.nodes.createNode(this, n);
    var node = this;
    this.config = RED.nodes.getNode(n.config);

    this.on('input', function(msg) {
      var wunderlistAPI = wunderlistSDK.getApi(node.config, msg);
      var subtasks = wunderlistAPI.http.subtasks;

      var params = {
        'task_id': Number(n.taskId || msg.taskId),
        'title': n.subtaskTitle || msg.payload
      };

      subtasks.create(params)
      .done(function (taskData, statusCode) {
        msg.subtask = taskData;
        node.send(msg);
      })
      .fail(function (resp, code) {
        node.error(resp || 'Wunderlist API error');
      });
    });
  }
  RED.nodes.registerType('wunderlist-create-subtask', WunderlistCreateSubtask);
};
