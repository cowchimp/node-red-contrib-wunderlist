var wunderlistSDK = require('./wunderlist-sdk');

module.exports = function(RED) {
  function WunderlistGetComments(n) {
    RED.nodes.createNode(this, n);
    var node = this;
    this.config = RED.nodes.getNode(n.config);

    this.on('input', function(msg) {
      var wunderlistAPI = wunderlistSDK.getApi(node.config, msg);
      var comments = wunderlistAPI.http.task_comments;

      var listId = n.listId || msg.listId || false;
      var taskId = n.taskId || msg.taskId || false;

      if (taskId){
        comments.forTask(taskId)
        .done((taskCommentsData, statusCode) => {
          msg.payload = taskCommentsData;
          node.send(msg);
        })
        .fail((resp, code) => {
          node.error(resp || 'Wunderlist API error');
        });
      } else if (listId){
        comments.forList(listId)
        .done((taskCommentsData, statusCode) => {
          msg.payload = taskCommentsData;
          node.send(msg);
        })
        .fail((resp, code) => {
          node.error(resp || 'Wunderlist API error');
        });
      }
    });
  }
  RED.nodes.registerType('wunderlist-get-comments', WunderlistGetComments);
};
