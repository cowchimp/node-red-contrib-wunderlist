var wunderlistSDK = require('./wunderlist-sdk');

module.exports = function(RED) {
  function WunderlistComment(n) {
    RED.nodes.createNode(this, n);
    var node = this;
    this.config = RED.nodes.getNode(n.config);

    this.on('input', function(msg) {
      var wunderlistAPI = wunderlistSDK.getApi(node.config, msg);
      var comments = wunderlistAPI.http.task_comments;

      var params = {
        'task_id': Number(n.taskId || msg.taskId),
        'text': n.comment || msg.payload
      };

      comments.create(params)
      .done(function (taskData, statusCode) {
        msg.comment = taskData;
        node.send(msg);
      })
      .fail(function (resp, code) {
        node.error(resp || 'Wunderlist API error');
      });
    });
  }
  RED.nodes.registerType('wunderlist-create-comment', WunderlistComment);
};
