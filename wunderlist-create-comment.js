var wunderlistSDK = require('./wunderlist-sdk');

module.exports = function(RED) {
  function WunderlistComment(n) {
    RED.nodes.createNode(this, n);
    var node = this;
    this.config = RED.nodes.getNode(n.config);

    this.on('input', function(msg, send, done) {
      send = send || function() { node.send.apply(node,arguments) };

      var wunderlistAPI = wunderlistSDK.getApi(node.config, msg);
      var comments = wunderlistAPI.http.task_comments;

      var params = {
        'task_id': Number(n.taskId || msg.taskId),
        'text': n.comment || msg.payload
      };

      comments.create(params)
      .done(function (taskData, statusCode) {
        msg.comment = taskData;
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
  RED.nodes.registerType('wunderlist-create-comment', WunderlistComment);
};
