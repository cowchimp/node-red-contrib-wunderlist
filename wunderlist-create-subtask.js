var wunderlistSDK = require('./wunderlist-sdk');

module.exports = function(RED) {
  function WunderlistCreateSubtask(n) {
    RED.nodes.createNode(this, n);
    var node = this;
    this.config = RED.nodes.getNode(n.config);

    this.on('input', function(msg, send, done) {
      send = send || function() { node.send.apply(node,arguments) };

      var wunderlistAPI = wunderlistSDK.getApi(node.config, msg);
      var subtasks = wunderlistAPI.http.subtasks;

      var params = {
        'task_id': Number(n.taskId || msg.taskId),
        'title': n.subtaskTitle || msg.payload
      };

      subtasks.create(params)
      .done(function (taskData, statusCode) {
        msg.subtask = taskData;
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
  RED.nodes.registerType('wunderlist-create-subtask', WunderlistCreateSubtask);
};
